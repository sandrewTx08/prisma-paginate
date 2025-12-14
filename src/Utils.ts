export function pick<
	Object extends Record<ObjectKey, Object[ObjectKey]>,
	Keys extends ObjectKey[],
	ObjectKey extends keyof Object = keyof Object,
>(object: Object, ...keys: Keys): Pick<Object, Keys[number]> {
	const result: Partial<Object> = {};

	for (const key of keys) {
		if (key in object) {
			result[key] = object[key];
		}
	}

	return result as Pick<Object, Keys[number]>;
}
