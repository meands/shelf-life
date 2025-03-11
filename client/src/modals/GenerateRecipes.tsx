import { Button, Checkbox, Loader, Stack, Text } from "@mantine/core";
import { useItems } from "@api/item";
import { useState } from "react";
import untruncateJson from "untruncate-json";
import { generateRecipes } from "@api/recipe";

export function GenerateRecipes() {
  const { data: items, isLoading: isLoadingItems } = useItems();
  const [recipes, setRecipes] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    const selectedItemObjects = items?.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedItemObjects) {
      setIsGenerating(true);
      for await (const chunk of generateRecipes(selectedItemObjects)) {
        setRecipes((prev) => prev + chunk);
      }
      setIsGenerating(false);
    }
  };

  if (isLoadingItems) {
    return (
      <Stack align="center">
        <Loader />
        <Text>Loading items...</Text>
      </Stack>
    );
  }
  if (!items?.length) {
    return (
      <Stack align="center">
        <Text>No items found. Add some items first!</Text>
      </Stack>
    );
  }
  return (
    <Stack>
      <Text>Select items to generate recipes from:</Text>
      <Checkbox
        label="Select All"
        checked={items.length === selectedItems.length}
        onChange={(event) =>
          setSelectedItems(
            event.currentTarget.checked ? items.map((item) => item.id) : []
          )
        }
      />
      {items.map((item) => (
        <Checkbox
          key={item.id}
          label={`${item.name} (${item.quantity} ${item.unit})`}
          checked={selectedItems.includes(item.id)}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              setSelectedItems([...selectedItems, item.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== item.id));
            }
          }}
        />
      ))}
      <Button
        onClick={handleSubmit}
        loading={isGenerating}
        disabled={selectedItems.length === 0}
      >
        Generate Recipes
      </Button>

      {recipes && (
        <Stack mt="md">
          <Text fw={500}>Generated Recipes:</Text>
          {safeParse(untruncateJson(recipes))?.recipes?.map(
            (recipe: any, index: number) => (
              <Stack key={index}>
                <Text fw={500}>{recipe?.name}</Text>
                <Text size="sm">
                  Ingredients: {recipe?.ingredients?.join(", ")}
                </Text>
                <Text size="sm">{recipe?.instructions}</Text>
              </Stack>
            )
          )}
        </Stack>
      )}
    </Stack>
  );
}

function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("error parsing", error);
    return {};
  }
}
