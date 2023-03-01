import { UserBusiness } from "../../src/business/UserBusiness"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("deleteUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("retorna um erro caso 'token' não seja uma string", async () => {
        expect.assertions(2)

        try {
            const token : DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: null
            }
            
            await userBusiness.deleteUser(token)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("requer token")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna um erro caso 'token' seja inválido", async () => {
        expect.assertions(2)

        try {
            const token : DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: "token"
            }
            
            await userBusiness.deleteUser(token)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna um erro caso 'role: normal' queira deletar contas", async () => {
        expect.assertions(2)

        try {
            const token : DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: "token-mock-normal"
            }
            
            await userBusiness.deleteUser(token)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("somente admins podem deletar contas")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna um erro caso 'idToDelete' não for cadastrada", async () => {
        expect.assertions(2)

        try {
            const token : DeleteUserInputDTO = {
                idToDelete: "id-",
                token: "token-mock-admin"
            }
            
            await userBusiness.deleteUser(token)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})