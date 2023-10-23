declare module "*.png" {
   const url: string;
   export default url;
}

declare module "*.ldtk" {
   const ldtk: Record<string, any>;
   export default ldtk;
}
