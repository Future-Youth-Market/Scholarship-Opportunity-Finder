declare module "virtual:fym-data" {
  const data: import("./data/schema").Listing[];
  export const preview: boolean;
  export const dataError: string | null;
  export default data;
}
