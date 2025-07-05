"use client";
import grapeVarietiesData from "@/app/model/grapeVarieties.json";
import useGrapeVarietySelection from "./Hooks/useGrapeVarietySelection";
import { GrapeVariety } from "./GrapeVarietySelection.types";

const GrapeVarietySelection = () => {
    const grapeVarieties: string[] = Object.values(grapeVarietiesData);
    const { formik, savingMessage, isSelected, handleGrapeVarietySelection, handleGrapeVarietyPercentageChange } = useGrapeVarietySelection();

    return (
        <div className="w-full px-48 py-12">
            {savingMessage && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-2 rounded-md shadow-lg z-50 w-auto max-w-md break-words ${
                    savingMessage.type === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    {savingMessage.text}
                </div>
            )}
            <form onSubmit={formik.handleSubmit} className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-1">
                {grapeVarieties.map((grapeVariety: string) => (
                    <div key={grapeVariety} className="flex flex-row justify-between gap-4">
                        <label>{grapeVariety}</label>
                        <div className="flex flex-row gap-2">
                            {isSelected(grapeVariety) && (
                                <input
                                    type="text"
                                    value={formik.values.selectedVarieties.find((v) => v.name === grapeVariety)?.percentage ?? ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGrapeVarietyPercentageChange(grapeVariety, e.target.value) }
                                    className="w-12 text-center border-1 border-gray-300 rounded-md"
                                />
                            )}
                            <input
                                type="checkbox"
                                checked={isSelected(grapeVariety)}
                                onChange={() => handleGrapeVarietySelection(grapeVariety)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col max-w-[274px]">
                <div className="text-2xl font-bold mb-4">Ausgewählte Rebsorten</div>
                {formik.values.selectedVarieties.map((variety: GrapeVariety) => (
                    <div key={variety.name}>
                        {variety.name} {variety.percentage ? `${variety.percentage}%` : ''}
                    </div>
                ))}
                <div className="flex flex-col gap-1">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Speichern</button>
                    {formik.errors.selectedVarieties && typeof formik.errors.selectedVarieties === "string" && (
                        <div className="text-red-600 text-xs break-words">{formik.errors.selectedVarieties}</div>
                    )}
                </div>
            </div>
            </form>
        </div>
    );
};

export default GrapeVarietySelection;