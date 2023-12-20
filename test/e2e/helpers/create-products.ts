import { getAllDatabases } from './connections'

export const createProducts = async (companyIdentifier: string) => {
  const connection = await getAllDatabases()
  await connection.query(
    `INSERT INTO ${companyIdentifier}.product (name, price, quantity) VALUES ('product1', 12300, 10)`
  )

  await connection.query(
    `INSERT INTO ${companyIdentifier}.product (name, price, quantity) VALUES ('product2', 14000, 10)`
  )

  await connection.query(
    `INSERT INTO ${companyIdentifier}.product (name, price, bulkPrice, quantity, quantityKg, quantityKgActual) VALUES ('product3', 14000, 2350, 10, 12, 3.2)`
  )
  await connection.close()
}
