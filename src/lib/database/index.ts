import { DataSource } from "typeorm";
import { Shopping, Sale } from "./entity";

export const dataSource = new DataSource({
  database: "compra-venda-fumos.db",
  entities: [Shopping, Sale],
  type: "expo",
  driver: require("expo-sqlite"),
  synchronize: true,
});
