import { Button, Checkbox, Loader, Stack, Text } from "@mantine/core";
import { useGenerateRecipes } from "@api/recipe";
import { useItems } from "@api/item";
import { useState } from "react";

export function GenerateRecipes() {
  const { data: items, isLoading: isLoadingItems } = useItems();
  const {
    mutateAsync: generateRecipes,
    isPending,
    data: recipes,
  } = useGenerateRecipes();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSubmit = () => {
    const selectedItemObjects = items?.filter((item) =>
      selectedItems.includes(item.id)
    );
    selectedItemObjects && generateRecipes(selectedItemObjects);
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
        loading={isPending}
        disabled={selectedItems.length === 0}
      >
        Generate Recipes
      </Button>

      {recipes && (
        <Stack mt="md">
          <Text fw={500}>Generated Recipes:</Text>
          {recipes.recipes.map((recipe, index) => (
            <Stack key={index} gap="xs">
              <Text fw={500}>{recipe.name}</Text>
              <Text size="sm">
                Ingredients: {recipe.ingredients.join(", ")}
              </Text>
              <Text size="sm">{recipe.instructions}</Text>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
