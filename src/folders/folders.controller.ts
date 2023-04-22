import { Controller, Delete, Post, Get, Req, Res, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { IFolder } from './folders';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { postgres } from 'src/postgres';
import { useMe } from 'src/funcs/useMe';
import { IoAdapter } from '@nestjs/platform-socket.io';

@Controller('folders')
export class FoldersController extends IoAdapter {
  @Get()
  async getFolders(
    @Req()
    request: Request,
    @Res() response: Response,
  ) {
    const me = useMe(request, response);

    const pg = await postgres();
    const query = {
      text: `SELECT * from folders WHERE created_by = '${me}'`,
    };
    pg.query(query, (err, res) => {
      if (err) {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      } else {
        response.status(200).send({
          response: res.rows,
        });
      }
    });
  }
  @Post()
  async addFolder(
    @Req()
    request: Request<any, any, IFolder>,
    @Res() response: Response,
  ) {
    const { name, position, ts } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        name: 'string',
        order: 'number',
        ts: 'number',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const pg = await postgres();
    const query = {
      text: 'INSERT INTO folders(name, position, ts, created_by) VALUES($1, $2, $3, $4)',
      values: [name, position, ts, me],
    };
    pg.query(query, (err, res) => {
      if (err) {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      } else {
        response.status(200).send({
          response: true,
        });
      }
    });
  }
  @Delete()
  async deleteFolder(
    @Req()
    request: Request<
      any,
      any,
      {
        id: number;
      }
    >,
    @Res() response: Response,
  ) {
    const { id } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        id: 'number',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const pg = await postgres();
    const query = {
      text: `DELETE FROM folders WHERE id = ${id} AND created_by = '${me}'`,
      values: [],
    };
    pg.query(query, (err, res) => {
      if (err) {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      } else {
        response.status(200).send({
          response: true,
        });
      }
    });
  }
  setByKeys(obj: Record<string, any>) {
    const shallowCopy = { ...obj };
    return Object.keys(shallowCopy)
      .filter((v) => obj[v])
      .map(
        (v) => `${v} = ${typeof obj[v] === 'string' ? `'${obj[v]}'` : obj[v]}`,
      )
      .join(', ');
  }
  @Put()
  async updateFolder(
    @Req()
    request: Request<
      any,
      any,
      {
        id: number;
      } & (IFolder | null)
    >,
    @Res() response: Response,
  ) {
    const { id } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        id: 'number',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const body = {
      name: request.body?.name,
      position: request?.body?.position,
    };

    const pg = await postgres();
    console.log(this.setByKeys(body));
    const query = {
      text: `UPDATE folders SET ${this.setByKeys(
        body,
      )} WHERE id = ${id} AND created_by = '${me}'`,
    };
    pg.query(query, (err, res) => {
      if (err) {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      } else {
        response.status(200).send({
          response: true,
        });
      }
    });
  }
}
