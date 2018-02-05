module.exports = {
	servers: [
		{
			hostname: "144.76.27.210",
			username: "neokarma",
			privateKey: "./deploy/neokarma-gb-1-neokarma.ppk",
			environments: {
				
			}
		}
	],
	environments: {
		dev: {
			repository: "git@github.com:veivo/neokarma-frontend.git",
			branch: "orgin/master",
			gitPrivateKey: "/home/neokarma/.ssh/github-neokarma-frontend.ppk",
			remote: "/home/neokarma/test-apps/neokarma-frontend/",
			cwd: "/home/neokarma/test-apps/neokarma-frontend/",
			stop_scripts: [
			],
			pre_setup: [
			],
			status_scripts: [
			],
			builddirectory: "/dist",
			pre_install: [
				"npm install",
				"ng build --prod --env=test",
			],
			post_install: [
				//"pm2 start start.sh -i 6",
			],
			start_scripts: [
				//"chmod 0777 /home/neokarma/dev-cluster.sock"
			],
		},
	}
	
};