# pytest app/ --cov=app --cov-report=xml

import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_create_item():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"name": "Test item", "description": "Sample", "price": 10.0}
        response = await ac.post("/items/", json=payload)
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["name"] == "Test item"
