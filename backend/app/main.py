from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas, models 
from .database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator 


app = FastAPI()


instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app)


origins = ["http://localhost:3000"]  # cho phép React truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Tạo bảng trong DB
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with SessionLocal() as session:
        yield session


@app.get("/items/", response_model=list[schemas.Item])
async def read_items(db: AsyncSession = Depends(get_db)):
    return await crud.get_items(db)


@app.post("/items/", response_model=schemas.Item)
async def create_item(item: schemas.ItemCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_item(db, item)


@app.put("/items/{item_id}", response_model=schemas.Item)
async def update_item(
    item_id: int, item: schemas.ItemCreate, db: AsyncSession = Depends(get_db)
):
    db_item = await crud.get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.name = item.name
    db_item.description = item.description
    await db.commit()
    await db.refresh(db_item)
    return db_item


@app.delete("/items/{item_id}")
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
    db_item = await crud.get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(db_item)
    await db.commit()
    return {"message": "Deleted successfully"}

