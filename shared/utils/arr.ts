export const partition = <T>(
  elements: T[],
  predicate: (element: T) => boolean
): [T[], T[]] =>
  elements.reduce(
    ([trueElements, falseElements], element) =>
      predicate(element)
        ? [[...trueElements, element], falseElements]
        : [trueElements, [...falseElements, element]],
    [[] as T[], [] as T[]]
  );
