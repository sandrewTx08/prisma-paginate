export class Utils {
	static pick<O extends Record<any, any>, K extends (keyof O)[]>(
		object: O,
		...keys: K
	): Pick<O, K extends (infer K)[] ? K : never> {
		const o = { ...object };
		const m = new Map(keys.map((k) => [k, true]));
		for (const k of Object.keys(o)) if (!m.get(k)) delete o[k];
		return o;
	}
}
