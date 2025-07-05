import * as Yup from "yup";

export const validationSchema = Yup.object({
  selectedVarieties: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        percentage: Yup.number()
          .min(0, "Min 0%")
          .max(100, "Max 100%")
          .nullable(),
      })
    )
    .test(
      "sum-100",
      "Die Summe der Prozentwerte muss 100% ergeben",
      (selectedVarieties) => {
        if (!selectedVarieties || selectedVarieties.length === 0) return true;
        if (
          selectedVarieties.some(
            (variety) =>
              variety.percentage === undefined || variety.percentage === null
          )
        )
          return true;
        const sum = selectedVarieties.reduce(
          (acc, variety) => acc + Number(variety.percentage),
          0
        );
        return sum === 100;
      }
    )
    .test(
      "single-no-percentage",
      "Wenn nur eine Sorte ausgewählt ist, darf der Prozentwert nicht gesetzt werden.",
      (selectedVarieties) => {
        if (!selectedVarieties || selectedVarieties.length !== 1) return true;
        const [variety] = selectedVarieties;
        return variety.percentage === undefined || variety.percentage === null;
      }
    )
    .test(
      "all-or-none-percentages",
      "Wenn ein Prozentwert gesetzt ist, müssen alle ausgewählten Sorten einen Prozentwert haben.",
      (selectedVarieties) => {
        if (!selectedVarieties || selectedVarieties.length <= 1) return true;
        const anyHasPercentage = selectedVarieties.some(
          (variety) =>
            variety.percentage !== undefined && variety.percentage !== null
        );
        if (!anyHasPercentage) return true;
        return selectedVarieties.every(
          (variety) =>
            variety.percentage !== undefined && variety.percentage !== null
        );
      }
    ),
});
