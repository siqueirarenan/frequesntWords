import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Column,
  Entity,
  EntityManager,
  ManyToOne,
  OneToMany,
  QueryFailedError,
} from 'typeorm';
import { Base } from '../base.entity';
import { BaseTransactionRepo } from '../base.transaction.repository';

describe('testing TypeORM base repo layer / adapter', () => {
  let manager: EntityManager;
  let testRepo: TestRepo;
  let relationRepo: RelationTestRepo;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TestEntity, RelationTestEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TestEntity, RelationTestEntity]),
      ],
      providers: [
        TestRepo,
        RelationTestRepo,
        {
          provide: REQUEST,
          useClass: ReqMockProvider,
        },
      ],
    }).compile();

    manager = module.get(EntityManager);
    testRepo = module.get(TestRepo);
    relationRepo = module.get(RelationTestRepo);
  });

  afterEach(async () => {
    await manager.clear(RelationTestEntity);
    await manager.clear(TestEntity);
    await manager // Reseting Ids
      .createQueryBuilder()
      .delete()
      .from('sqlite_sequence')
      .execute();
  });

  it('should find all entities', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });

    const result = await testRepo.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(1);
    expect(result[0].name).toEqual('test1');
    expect(result[0].createdAt).not.toBeNull();
    expect(result[0].updatedAt).not.toBeNull();
    expect(result[0].createdAt).toEqual(result[0].updatedAt);
    expect(result[0].deletedAt).toBeNull();
    expect(result[0].optionalProp).toBeNull();
  });

  it('should find no entity if table is empty', async () => {
    const result = await testRepo.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find all entities filtering by column value', async () => {
    await manager.insert(TestEntity, {
      name: 'test1',
      optionalProp: '1',
    });
    await manager.insert(TestEntity, {
      name: 'test2',
      optionalProp: '2',
    });
    await manager.insert(TestEntity, {
      name: 'test3',
      optionalProp: '1',
    });

    const result = await testRepo.findAll({ optionalProp: '1' });

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(3);
    expect(result[0].name).toEqual('test1');
    expect(result[1].name).toEqual('test3');
  });

  it('should find all entities with include', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(RelationTestEntity, { name: 'realtion1', testId: 1 });
    await manager.insert(RelationTestEntity, { name: 'realtion2', testId: 2 });

    const result = await relationRepo.findAll(null, ['test']);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(RelationTestEntity);
    expect(result[0].test).not.toBeNull();
    expect(result[0].test.id).toEqual(1);
    expect(result[0].test.name).toEqual('test1');
    expect(result[1].test).not.toBeNull();
    expect(result[1].test.id).toEqual(2);
    expect(result[1].test.name).toEqual('test2');
  });

  it('should find all entities without include', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(RelationTestEntity, { name: 'realtion1', testId: 1 });
    await manager.insert(RelationTestEntity, { name: 'realtion2', testId: 2 });

    const result = await relationRepo.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(RelationTestEntity);
    expect(result[0].test).toBeUndefined();
    expect(result[1].test).toBeUndefined();
  });

  it('should find paginated entities', async () => {
    await manager.insert(TestEntity, { name: 'test5' });
    await manager.insert(TestEntity, { name: 'test4' });
    await manager.insert(TestEntity, { name: 'test3' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test1' });

    let page = 1;
    let limit = 10;
    let result = await testRepo.findPaginated(limit, page);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Array);
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test5');
    expect(result[1]).toEqual(5);

    page = 1;
    limit = 3;
    result = await testRepo.findPaginated(limit, page);
    expect(result[0].length).toEqual(3);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test5');
    expect(result[1]).toEqual(5);

    page = 2;
    limit = 3;
    result = await testRepo.findPaginated(limit, page);
    expect(result[0].length).toEqual(2);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test2');
    expect(result[1]).toEqual(5);
  });

  it('should find paginated entities ordered by name', async () => {
    await manager.insert(TestEntity, { name: 'test5' });
    await manager.insert(TestEntity, { name: 'test4' });
    await manager.insert(TestEntity, { name: 'test3' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test1' });

    let page = 1;
    let limit = 10;
    let result = await testRepo.findPaginated(limit, page, 'name');
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Array);
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test1');
    expect(result[1]).toEqual(5);

    page = 1;
    limit = 3;
    result = await testRepo.findPaginated(limit, page, 'name');
    expect(result[0].length).toEqual(3);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test1');
    expect(result[1]).toEqual(5);

    page = 2;
    limit = 3;
    result = await testRepo.findPaginated(limit, page, 'name');
    expect(result[0].length).toEqual(2);
    expect(result[0][0]).toBeInstanceOf(TestEntity);
    expect(result[0][0].name).toEqual('test4');
    expect(result[1]).toEqual(5);
  });

  it('should throw error if page limit or page are invalid', async () => {
    try {
      await testRepo.findPaginated(0, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toContain('Page limit and page must');
    }
  });

  it('should find the first entity filtering by column value', async () => {
    await manager.insert(TestEntity, {
      name: 'test1',
      optionalProp: '1',
    });
    await manager.insert(TestEntity, {
      name: 'test2',
      optionalProp: '2',
    });
    await manager.insert(TestEntity, {
      name: 'test3',
      optionalProp: '2',
    });

    const result = await testRepo.findOne({ optionalProp: '2' });

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(2);
    expect(result.name).toEqual('test2');
    expect(result.optionalProp).toEqual('2');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
  });

  it('should throw error to find the first entity if column value does not exist', async () => {
    await manager.insert(TestEntity, {
      name: 'test1',
      optionalProp: '1',
    });
    await manager.insert(TestEntity, {
      name: 'test2',
      optionalProp: '2',
    });

    try {
      await testRepo.findOne({ optionalProp: '3' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw error to find the first entity if it is deleted', async () => {
    await manager.insert(TestEntity, {
      name: 'test1',
      deletedAt: new Date(),
    });

    try {
      await testRepo.findOne({ name: 'test1' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should find entities by a list of Ids', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test3' });

    const result = await testRepo.findByIds([2, 3]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(TestEntity);
    expect(result[0].id).toEqual(2);
    expect(result[1].id).toEqual(3);
    expect(result[0].name).toEqual('test2');
    expect(result[1].name).toEqual('test3');
  });

  it('should find no entity if list of ids contains invalid ids', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test3' });

    const result = await testRepo.findByIds([5, 6]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find no entity if list of ids is empty', async () => {
    await manager.insert(TestEntity, { name: 'test1' });

    const result = await testRepo.findByIds([]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  it('should find one entity by Id with no relations', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(RelationTestEntity, { name: 'relation1', testId: 1 });

    const result = await testRepo.findById(1);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('test1');
    expect(result.optionalProp).toBeNull();
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
    expect(result.relations).toBeUndefined();
  });

  it('should find one entity by Id with its relations', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(RelationTestEntity, { name: 'relation1', testId: 1 });
    await manager.insert(RelationTestEntity, { name: 'relation2', testId: 1 });

    const result = await testRepo.findById(1, ['relations']);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('test1');
    expect(result.optionalProp).toBeNull();
    expect(result.relations).toBeInstanceOf(Array);
    expect(result.relations.length).toEqual(2);
    expect(result.relations[0]).toBeInstanceOf(RelationTestEntity);
    expect(result.relations[0].name).toEqual('relation1');
    expect(result.relations[1].name).toEqual('relation2');
    expect(result.relations[1].test).toBeUndefined();
  });

  it('should find one entity by Id with its zero relations', async () => {
    await manager.insert(TestEntity, { name: 'test1' });

    const result = await testRepo.findById(1, ['relations']);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('test1');
    expect(result.optionalProp).toBeNull();
    expect(result.relations).toBeInstanceOf(Array);
    expect(result.relations.length).toEqual(0);
  });

  it('should throw an error if no entity is found by id', async () => {
    await manager.insert(TestEntity, { name: 'test1' });

    try {
      await testRepo.findById(10, ['relations']);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw error to find by id if it is deleted', async () => {
    await manager.insert(TestEntity, {
      name: 'test1',
      deletedAt: new Date(),
    });

    try {
      await testRepo.findById(1);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should insert a new entity and return it with all relations', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    const entity = new RelationTestEntity();
    entity.name = 'relation1';
    entity.testId = 1;

    const result = await relationRepo.upsert(entity);

    expect(result).toBeInstanceOf(RelationTestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('relation1');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
    expect(result.testId).toEqual(1);
    expect(result.test).not.toBeNull();
    expect(result.test).toBeInstanceOf(TestEntity);
    expect(result.test.name).toEqual('test1');
  });

  it('should throw an error when insert a new entity without mandatory field', async () => {
    const entity = new TestEntity();

    try {
      await testRepo.upsert(entity);
    } catch (e) {
      expect(e).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should throw an error when insert a new entity with repetitive unique field', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    const entity = new TestEntity();
    entity.name = 'test1';

    try {
      await testRepo.upsert(entity);
    } catch (e) {
      expect(e).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should insert many new entities and return them without relations', async () => {
    const entity1 = new TestEntity();
    entity1.name = 'test1';
    const entity2 = new TestEntity();
    entity2.name = 'test2';

    const result = await testRepo.insertBulk([entity1, entity2]);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual(1);
    expect(result[0].name).toEqual('test1');
    expect(result[0].createdAt).not.toBeNull();
    expect(result[0].updatedAt).not.toBeNull();
    expect(result[0].createdAt).toEqual(result[0].updatedAt);
    expect(result[0].deletedAt).toBeNull();
    expect(result[0].optionalProp).toBeNull();
    expect(result[0].relations).toBeUndefined();
  });

  it('should update an entity and return it with all relations', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    const entity = new TestEntity();
    entity.name = 'new name';
    await new Promise((f) => setTimeout(f, 1000));

    const result = await testRepo.update(1, entity);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('new name');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).not.toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
    expect(result.optionalProp).toBeNull();
    expect(result.relations).not.toBeNull();
    expect(result.relations).toBeInstanceOf(Array);
    expect(result.relations.length).toEqual(0);
  });

  it('should update an entity only with the passed properties', async () => {
    await manager.insert(TestEntity, { name: 'test1', optionalProp: '1' });
    const entity = new TestEntity();
    entity.optionalProp = 'new prop';
    await new Promise((f) => setTimeout(f, 1000));

    const result = await testRepo.update(1, entity);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('test1');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).not.toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
    expect(result.optionalProp).toEqual('new prop');
    expect(result.relations).not.toBeNull();
    expect(result.relations).toBeInstanceOf(Array);
    expect(result.relations.length).toEqual(0);
  });

  it('should update an entity even if passed with different id', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    const entity = new TestEntity();
    entity.id = 2;
    entity.name = 'new name';
    await new Promise((f) => setTimeout(f, 1000));

    const result = await testRepo.update(1, entity);

    expect(result).toBeInstanceOf(TestEntity);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('new name');
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
    expect(result.createdAt).not.toEqual(result.updatedAt);
    expect(result.deletedAt).toBeNull();
    expect(result.optionalProp).toBeNull();
    expect(result.relations).not.toBeNull();
    expect(result.relations).toBeInstanceOf(Array);
    expect(result.relations.length).toEqual(0);
  });

  it('should throw an error when update with invalid id', async () => {
    try {
      await testRepo.update(10, new TestEntity());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw an error when update an new entity without mandatory field', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    const entity = new TestEntity();

    try {
      await testRepo.update(1, entity);
    } catch (e) {
      expect(e).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should throw an error when insert a new entity with repetitive unique field', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    const entity = new TestEntity();
    entity.name = 'test2';

    try {
      await testRepo.update(1, entity);
    } catch (e) {
      expect(e).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should soft-delete an entity', async () => {
    await manager.insert(TestEntity, { name: 'test1' });

    await testRepo.delete(1);

    const entity = await manager.findOne(TestEntity, {
      where: { id: 1 },
      withDeleted: true,
    });

    expect(entity.deletedAt).not.toBeNull();
  });

  it('should throw an error if deleting an entity with an invalid id', async () => {
    try {
      await testRepo.delete(1);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should count all entities', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test3' });

    const result = await testRepo.countAll();

    expect(result).toEqual(3);
  });

  it('should count all entities with condition', async () => {
    await manager.insert(TestEntity, { name: 'test1' });
    await manager.insert(TestEntity, { name: 'test2' });
    await manager.insert(TestEntity, { name: 'test3' });

    const result = await testRepo.countAll({ name: 'test2' });

    expect(result).toEqual(1);
  });
});

@Entity()
class TestEntity extends Base {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  optionalProp: string;

  @OneToMany(() => RelationTestEntity, (relation) => relation.test)
  relations: RelationTestEntity[];
}

@Entity()
class RelationTestEntity extends Base {
  @Column()
  name: string;

  @ManyToOne(() => TestEntity, (test) => test.relations)
  test: TestEntity;

  @Column()
  testId: number;
}

class TestRepo extends BaseTransactionRepo<TestEntity> {
  constructor(
    @InjectRepository(TestEntity)
    repo: Repository<TestEntity>,
    @Inject(REQUEST) req: any,
  ) {
    super(repo, req);
  }
}

class RelationTestRepo extends BaseTransactionRepo<RelationTestEntity> {
  constructor(
    @InjectRepository(RelationTestEntity)
    repo: Repository<RelationTestEntity>,
    @Inject(REQUEST) req: any,
  ) {
    super(repo, req);
  }
}

@Injectable()
class ReqMockProvider {
  queryRunner: any;
  constructor(manager: EntityManager) {
    this.queryRunner = manager.connection.createQueryRunner();
  }
}
