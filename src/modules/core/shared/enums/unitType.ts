export enum UnitType {
	FLOAT = "float",
	UNSIGNED_BYTE = "unsigned-byte",
}

export const convertUnitTypeToContextUnitType = (
	context: WebGLRenderingContext,
	unitType: UnitType
): number => {
	switch (unitType) {
		case UnitType.FLOAT:
			return context.FLOAT;
		case UnitType.UNSIGNED_BYTE:
			return context.UNSIGNED_BYTE;
	}
};
