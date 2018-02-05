// Gulp Stuff
var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

var ssh = require("ssh2");

var minimist = require('minimist');

// Tasks
gulp.task("deploy", function (done)
{
	
	let options = minimist(process.argv.splice(3));
	if(!options.target)
	{
		gutil.log(gutil.colors.red("[Deploy] Please specify target with --target <hostname>"));
		return done();
	}

	if(!options.environment)
	{
		gutil.log(gutil.colors.red("[Deploy] Please specify target environment with --environment <env>"));
		return done();
	}
	
	let StopProcesses = true;
	let GitUpdate = true;
	let SetupWorkspace = false;
	let StartProcesses = true;
	let RollUpdate = true;
	let ShowStatus = false;

	if(options.setup)
	{
		SetupWorkspace = true;
	}

	if(options.roll)
	{
		StopProcesses = false;
		GitUpdate = false;
		StartProcesses = false;
		RollUpdate = true;
	}

	if(options.stop)
	{
		StopProcesses = true;
		GitUpdate = false;
		StartProcesses = false;
		RollUpdate = false;
	}

	if(options.start)
	{
		StopProcesses = false;
		GitUpdate = false;
		StartProcesses = true;
		RollUpdate = false;
	}

	if(options.restart)
	{
		StopProcesses = true;
		GitUpdate = false;
		StartProcesses = true;
		RollUpdate = false;
	}

	if(options.update)
	{
		StopProcesses = false;
		GitUpdate = true;
		StartProcesses = false;
		RollUpdate = true;
	}

	if(options.status)
	{
		StopProcesses = false;
		GitUpdate = false;
		StartProcesses = false;
		RollUpdate = false;
		ShowStatus = true;
	}




	gutil.log(gutil.colors.cyan("[Deploy]"), "Deploying to '", options.target, "' Environment: [", options.environment, "]");

	
	let deployConfig = require("../deploy.js");
	if(!deployConfig)
	{

	}

	let Target = deployConfig.servers.find( server => {
		if(server.hostname == options.target)
			return true;
		return false;
	});
	let Environment = deployConfig.environments[options.environment];
	if(!Target)
	{
		gutil.log(gutil.colors.red("[Deploy] Invalid Target: ", options.target, "not found"));
		return done();
	}
	if(!Environment)
	{
		gutil.log(gutil.colors.red("[Deploy] Invalid Environment: ", options.environment, "not found"));
		return done();
	}
	if(!Target.environments)
	{
		Target.environments = {};
	}

	let Application = Object.assign(Target.environments[options.environment] || {}, Environment);
	var conn = new ssh.Client();
	conn.on('ready', () =>
	{
		console.log(gutil.colors.green("[SSH] Connected", Target.username + "@" + Target.hostname));
		let scripts = [];

		if(ShowStatus)
		{
			scripts = [];
			for(let i in Application.status_scripts)
			{
				scripts.push(Application.status_scripts[i].replace("{$remotePath}", Application.remote + "build/"))
			}
		}

		if(StopProcesses)
		{
			gutil.log(gutil.colors.green("[Deploy] Upload finished. Starting application"));
			scripts = [];
			for(let i in Application.stop_scripts)
			{
				scripts.push(Application.stop_scripts[i].replace("{$remotePath}", Application.remote + "build/"))
			}
		}
		//ssh-agent bash -c 'ssh-add /home/neokarma/.ssh/github-neokarma-tracker.ppk; git clone git@github.com:veivo/neokarma-tracker.git';
		if(GitUpdate)
		{
			if(SetupWorkspace)
			{
				scripts.push("mkdir -p " + Application.remote + "{source,staging,build}");
				scripts.push("cd " + Application.remote + "source/;ssh-agent bash -c 'ssh-add " + Application.gitPrivateKey + ";git clone " + Application.repository + " .'");	
			}else{
				scripts.push("cd " + Application.remote + "source/;ssh-agent bash -c 'ssh-add " + Application.gitPrivateKey + ";git pull " + Application.repository + "'");	
			}
			scripts.push("rm -rf " + Application.remote + "staging");
			scripts.push("cp -r " + Application.remote + "source " + Application.remote + "staging");
			scripts.push("cd " + Application.remote + "staging/");

			if(SetupWorkspace)
			{
				for(let i in Application.pre_setup)
				{
					scripts.push("cd " + Application.remote + "staging/;" + Application.pre_setup[i])
				}
			}

			if(RollUpdate)
			{
				for(let i in Application.pre_install)
				{
					scripts.push("cd " + Application.remote + "staging/;" + Application.pre_install[i])
				}

		
				scripts.push("rm -rf " + Application.remote + "build");
				scripts.push("cp -r " + Application.remote + "staging" + Application.builddirectory + " " + Application.remote + "build");
			
				for(let i in Application.post_install)
				{
					scripts.push("cd " + Application.remote + "build/;" + Application.post_install[i])
				}
			}

		
		}

		let deployer = new DeploymentService(conn, Application);
		gutil.log(gutil.colors.green("[Deploy] Updating from github:", Application.repository));
		deployer.runScripts(scripts).then(() => {
			
			let files = [];
			if(RollUpdate)
			{
				gutil.log(gutil.colors.green("[Deploy] Success. Uploading server configuration files"));
				for(let i in Application.uploads)
				{
					Application.uploads[i].local = Application.uploads[i].local.replace("{$hostname}", Target.hostname);
					Application.uploads[i].local = Application.uploads[i].local.replace("{$user}", Target.user);
					Application.uploads[i].local = Application.uploads[i].local.replace("{$env}", options.environment);

					Application.uploads[i].remote = Application.uploads[i].remote.replace("{$hostname}", Target.hostname);
					Application.uploads[i].remote = Application.uploads[i].remote.replace("{$user}", Target.user);
					Application.uploads[i].remote = Application.uploads[i].remote.replace("{$env}", options.environment);
					files.push(Application.uploads[i]);
				}
			}
			deployer.uploadFiles(files, Application.remote + "build/").then( () => {
				
				if(StartProcesses)
				{
					gutil.log(gutil.colors.green("[Deploy] Upload finished. Starting application"));
					scripts = [];
					for(let i in Application.start_scripts)
					{
						scripts.push(Application.start_scripts[i].replace("{$remotePath}", Application.remote + "build/"))
					}
				}
				
				deployer.runScripts(scripts).then(() => {
					gutil.log(gutil.colors.green("[Deploy] Deployment was successfull!"));
					conn.end();
					return done();
				});
				
			})
			
		}).catch( () => {
			conn.end();
			gutil.log(gutil.colors.red("[Deploy] Failed"));
			return done();
		});

		
	}).connect({
		host: Target.hostname,
		port: Target.port || 22,
		username: Target.username,
		privateKey: require('fs').readFileSync(Target.privateKey)
	});
});

class DeploymentService
{
	constructor(Connection, Application)
	{
		this.Connection = Connection;
		this.Application = Application;
	}

	runScripts(scripts)
	{
		return new Promise((resolve, reject) => {
			let next = () => {
				let script = scripts.shift();
				if(!script)
				{
					return resolve();
				}
				this.runScript(script).then( () => {
					next();
				}).catch( () => {
					reject();
				});
			};
			next();
		});
		
			
		
	}

	runScript(script)
	{
		return new Promise((resolve, reject) => {
			console.log("[SSH]#>", gutil.colors.yellow(script));
			this.Connection.exec(script, (err, stream) => {
				this.handleStream(err, stream, resolve, reject);
			});
		});
		
	}

	handleStream(err, stream, resolve, reject)
	{
		stream.on("close", (code, signal) => {
			resolve();
		}).on('data', (data) =>
		{
			process.stdout.write(data.toString());
		}).stderr.on('data', (data) => {
			process.stdout.write(data.toString());
			if(data.indexOf("fatal") < 0)
			{
				return;
			}
			reject();
		});
	}

	uploadFiles(files, rootPath)
	{
		return new Promise((resolve, reject) => {
			this.Connection.sftp((err, sftp) =>
			{
				if (err)
				{
					reject();
					throw err;
				}
				let promises = [];
				for(let i in files)
				{
					let file = files[i];
					console.log("[SSH]#>", "Transfering files: ", gutil.colors.yellow( file.local),  " -> ", gutil.colors.yellow( rootPath + file.remote));
					promises.push(this.uploadFile(sftp, rootPath + file.remote, file.local, rootPath));
				}
				Promise.all(promises).then(() => {
					resolve();
				});
			});
		});
	}

	uploadFile(sftp, remote, local)
	{
		return new Promise((resolve, reject) => 
		{
			sftp.fastPut(local, remote, {}, (err, result) =>
			{
				if (err)
				{
					reject();
					throw err;
				}
				resolve();
			});
		});
	}

	deploy()
	{
	}
}