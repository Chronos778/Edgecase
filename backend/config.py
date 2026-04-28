"""
Edgecase Backend Configuration

Pydantic settings for environment-based configuration.
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    
    # Application
    app_name: str = "Edgecase"
    app_version: str = "0.1.0"
    debug: bool = False
    
    # PostgreSQL
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "edgecase"
    postgres_user: str = "edgecase"
    postgres_password: str = "edgecase_secret"
    
    @property
    def postgres_url(self) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    @property
    def postgres_url_sync(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    # Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "edgecase_secret"
    
    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    
    @property
    def qdrant_url(self) -> str:
        return f"http://{self.qdrant_host}:{self.qdrant_port}"
    
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3"
    ollama_embedding_model: str = "nomic-embed-text"
    
    # Weather API (Open-Meteo - free)
    open_meteo_base_url: str = "https://api.open-meteo.com/v1"
    
    # Scraping Configuration
    scraping_threads: int = 4
    scraping_delay_min: float = 1.0
    scraping_delay_max: float = 3.0
    scraping_timeout: int = 30
    
    # Proxy (optional)
    proxy_list_url: Optional[str] = None
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
