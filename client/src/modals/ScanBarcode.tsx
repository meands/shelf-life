import { useState } from "react";
import { Button, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { BarcodeScanner } from "@components/BarcodeScanner/BarcodeScanner";
import { useFetchProductByBarcode, extractItemData } from "@api/openFoodFacts";
import { modals } from "@mantine/modals";
import { CreateItemModal } from "./CreateItem";

export function ScanBarcodeForProduct() {
  const [barcode, setBarcode] = useState<string>();
  const [manualEntry, setManualEntry] = useState<boolean>(false);

  const { data: productData, isLoading } = useFetchProductByBarcode(barcode);

  const foundProduct =
    productData?.product && extractItemData(productData?.product);

  const handleBarcodeDetected = async (detectedBarcode: string) =>
    setBarcode(detectedBarcode);

  return (
    <Stack>
      {!barcode ? (
        manualEntry ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              setBarcode(formData.get("barcode") as string);
            }}
          >
            <TextInput
              placeholder="Enter barcode"
              value={barcode}
              name="barcode"
            />

            <Button onClick={() => setManualEntry(false)}>Back to Scan</Button>

            <Button type="submit">Lookup</Button>
          </form>
        ) : (
          <>
            <BarcodeScanner onDetected={handleBarcodeDetected} />
            <Button onClick={() => setManualEntry(true)}>Manual Entry</Button>
          </>
        )
      ) : (
        <></>
      )}

      {isLoading && (
        <Group justify="center">
          <Loader />
          <Text>Fetching product data...</Text>
        </Group>
      )}

      {foundProduct && (
        <>
          <Group justify="space-between">
            <div>Barcode: {barcode}</div>
            <Button variant="subtle" onClick={() => setBarcode(undefined)}>
              Scan Again
            </Button>
          </Group>

          {Object.entries(foundProduct).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}

          <Button
            onClick={() =>
              modals.open({
                children: <CreateItemModal initialValues={foundProduct} />,
              })
            }
          >
            Register with Listed Details
          </Button>
        </>
      )}
    </Stack>
  );
}
