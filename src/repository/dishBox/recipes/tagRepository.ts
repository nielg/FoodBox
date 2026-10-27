import sql from "@/lib/db";

async function getAllTags(): Promise<string[]> {
  try {
    const rows = await sql<{ value: string }[]>`SELECT value FROM dishBox.tags`;

    return rows.map((row) => row.value);
  } catch (error) {
    console.error("DB: failed to get all tags", error);
    throw new Error("DB, failed to get all tags", { cause: error });
  }
}

const TagRepository = {
  getAllTags,
};

export default TagRepository;
