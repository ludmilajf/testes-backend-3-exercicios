import { UserBusiness } from "../../src/business/UserBusiness"
import { GetByIdInputDTO } from "../../src/dtos/userDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { User } from "../../src/models/User"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("getById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("retorna um erro caso 'id' não exista", async () => {
        expect.assertions(2)

        try {
            const input : GetByIdInputDTO = {
                idToFind: "id-mock-anormal"
            }
            await userBusiness.getById(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})