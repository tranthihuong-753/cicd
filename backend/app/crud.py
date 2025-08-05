from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas

async def get_items(db: AsyncSession):
    result = await db.execute(select(models.Item))
    return result.scalars().all()

async def get_item(db: AsyncSession, item_id: int):
    return await db.get(models.Item, item_id)

async def create_item(db: AsyncSession, item: schemas.ItemCreate):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item
