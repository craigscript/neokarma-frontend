import { Pipe } from "@angular/core";

@Pipe({
    name: 'wordhightlight'
})
export class WordHighlightPipe
{
    transform(content, words:any=[])
	{
		content = content ? String(content).replace(/<[^>]+>/gm, '') : '';
		
		words.forEach( keyword => {
			content = content.replace(new RegExp(" " + keyword + " ", 'g'), ' <span class="label label-success">'+keyword+'</span> ')
			//content = content.replace(keyword, ' <b>asd'+keyword+'<b> ')
		});
        return content;
    }
}