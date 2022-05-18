import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Base } from './base.entity';

export class BaseRepo<T extends Base> {
  constructor(protected repository: Repository<T>) {}

  protected useTransaction() {
    void 0;
  }

  async findAll(
    where?: { [Property in keyof T]?: any },
    include?: (keyof T)[],
  ): Promise<T[]> {
    this.useTransaction();
    return await this.repository.find({
      where: where as any,
      relations: include as string[],
    });
  }

  async findPaginated(
    pageSize: number,
    page: number,
    orderBy: keyof T = 'id',
    where?: { [Property in keyof T]?: any },
    include?: (keyof T)[],
  ): Promise<[T[], number]> {
    this.useTransaction();
    if (pageSize <= 0 || page <= 0)
      throw new BadRequestException(
        'Page limit and page must be greater than 0',
      );
    return await this.repository.findAndCount({
      where: where as any,
      relations: include as string[],
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        [orderBy]: {
          direction: 'asc',
          nulls: 'LAST',
        },
      } as any,
    });
  }

  async findOne(where: { [Property in keyof T]?: any }): Promise<T> {
    this.useTransaction();
    const getElement = await this.repository.findOne({ where: where as any });
    if (!getElement)
      throw new NotFoundException(
        `${this.repository.metadata.targetName} not found`,
      );
    return getElement;
  }

  async findByIds(ids: number[]): Promise<T[]> {
    this.useTransaction();
    return await this.repository.findBy({ id: In(ids) as any });
  }

  async findById(id: number, include: (keyof T)[] = []): Promise<T> {
    this.useTransaction();
    const getElement = await this.repository.findOne({
      where: { id: id as any },
      relations: include as string[],
    });
    if (!getElement)
      throw new NotFoundException(
        `${this.repository.metadata.targetName} with id ${id} not found`,
      );
    return getElement;
  }

  async upsert(entity: T): Promise<T> {
    this.useTransaction();
    const createdEntity = await this.repository.save(entity);
    return await this.repository.findOne({
      where: { id: createdEntity.id as any },
      relations: this.repository.metadata.relations.map((x) => x.propertyName),
    });
  }

  async insertBulk(entities: T[]): Promise<T[]> {
    this.useTransaction();
    return await this.repository.save(entities);
  }

  async update(id: number, updatedEntity: T): Promise<T> {
    this.useTransaction();
    await this.findById(id);
    updatedEntity.id = id;
    await this.repository.save(updatedEntity);
    return await this.repository.findOne({
      where: { id: id as any },
      relations: this.repository.metadata.relations.map((x) => x.propertyName),
    });
  }

  async delete(id: number | number[]): Promise<any> {
    this.useTransaction();
    const deleteResponse = await this.repository.softDelete(id);
    if (deleteResponse.affected === 0) {
      throw new NotFoundException(
        `${this.repository.metadata.targetName} with id ${id} not found`,
      );
    }
  }

  async countAll(where?: { [Property in keyof T]?: any }): Promise<number> {
    this.useTransaction();
    return this.repository.count({ where: where as any });
  }
}
