import { useQuery } from "@tanstack/react-query";

interface OpenFoodFactsProduct {
  product: {
    product_name: string;
    product_quantity?: number;
    product_quantity_unit?: string;
    serving_quantity_unit?: string;
  };
  status: 0 | 1;
  status_verbose: "product not found" | "product found";
}

export function useFetchProductByBarcode(barcode?: string) {
  return useQuery<OpenFoodFactsProduct>({
    queryKey: ["product", barcode],
    queryFn: () =>
      barcode ? fetchProductByBarcode(barcode) : Promise.resolve(undefined),
    enabled: !!barcode,
  });
}

async function fetchProductByBarcode(barcode: string) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );

  return response.json();
}

export function extractItemData(product: OpenFoodFactsProduct["product"]) {
  return {
    name: product.product_name,
    quantity: product.product_quantity,
    unit: product.product_quantity_unit || product.serving_quantity_unit,
  };
}
