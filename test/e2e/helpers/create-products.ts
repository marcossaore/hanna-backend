import { getAllDatabases } from './connections'

export const createProducts = async (companyIdentifier: string) => {
  const connection = await getAllDatabases()
  await connection.query(
    `INSERT INTO ${companyIdentifier}.product (name, price) VALUES ('product1', 12300)`
  )

  await connection.query(
    `INSERT INTO ${companyIdentifier}.product (name, price) VALUES ('product2', 14000)`
  )
  await connection.close()
}
