export class ChartMath
{
	static Interpolate(Current, Target, DeltaTime, InterpSpeed = 1.0)
	{
		if( InterpSpeed <= 0.0 )
		{
			return Target;
		}

		// Distance to reach
		let Dist = Target - Current;

		if( Dist * Dist < 0.000001 )
		{
			return Target;
		}
		
		
		// Delta Move, Clamp so we do not over shoot.
		let DeltaMove = Dist * Math.min(Math.max(DeltaTime * InterpSpeed, 0.0), 1.0);

		return Current + DeltaMove;
	}
};