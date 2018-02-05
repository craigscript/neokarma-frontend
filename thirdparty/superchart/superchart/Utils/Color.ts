export class Color
{
	static rgb(r, g, b)
	{
		return "rgb(" + [r, g, b].join(",") + ")";
	}

	static rgba(r, g, b, a)
	{
		return "rgba(" + [r, g, b, a].join(",") + ")";
	}
};