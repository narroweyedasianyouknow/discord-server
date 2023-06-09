import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { RolesType, Roles } from './roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name)
    private rolesModel: Model<Roles>,
  ) {}

  async create(createPersonDto: RolesType) {
    const createdPerson = new this.rolesModel(createPersonDto);
    return createdPerson.save();
  }
}
