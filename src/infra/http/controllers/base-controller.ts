import { Request, Response } from 'express'

export abstract class BaseController {
  public abstract _handle(
    request: Request,
    response: Response,
  ): Promise<Response | void>

  public async handle(
    request: Request,
    response: Response,
  ): Promise<Response | void> {
    try {
      return await this._handle(request, response)
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
