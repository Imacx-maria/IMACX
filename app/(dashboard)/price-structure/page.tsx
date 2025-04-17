import { PriceCalculator } from "@/components/price-calculator/price-calculator";

export default function PriceStructurePage() {
  return (
    <div className="w-full py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl">Price Structure</h1>
      </div>
      
      <PriceCalculator />
    </div>
  );
}