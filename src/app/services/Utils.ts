import { Injectable } from '@angular/core';

export class Utils
{
	static copy(b:any): any
	{
		if(!b)
			return null;
		if(typeof b === "object")
		{
			var cloneObj = {};
			for (var attribut in b)
			{
				cloneObj[attribut] = Utils.copy(b[attribut]);
			}
			return Object.assign({}, cloneObj);
		}
		return b;
	}

	static ArrayMove(array:any[], old_index:number, new_index:number)
	{
		if (new_index >= array.length) {
			var k = new_index - array.length;
			while ((k--) + 1) {
				array.push(undefined);
			}
		}
		array.splice(new_index, 0, array.splice(old_index, 1)[0]);
		return array;
	}
}