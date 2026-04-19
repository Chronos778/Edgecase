import logging
import os
from typing import Optional
from agents.base import BaseAgent
from agents.state import Task

from google import genai

logger = logging.getLogger(__name__)


class LLMRouter(BaseAgent):
    """
    Smart router for Large Language Model tasks.
    
    Strategy:
    - GEMINI (default): Used for all analysis, extraction, risk scoring
    - OLLAMA: Used ONLY for RAG chat with context injection
    """

    def __init__(self):
        super().__init__(name="LLMRouter", agent_type="llm_router")
        self._setup_gemini()
        self._setup_ollama()
    
    def _setup_gemini(self):
        """Initialize Gemini client."""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key and api_key != "your_gemini_api_key_here":
                self.gemini_client = genai.Client(api_key=api_key)
                self.gemini_model = "gemini-1.5-flash"  # Fast and cost-effective
                self.has_gemini = True
                self.logger.info("Gemini API initialized (default for analysis)")
            else:
                self.has_gemini = False
                self.logger.warning("GEMINI_API_KEY not configured")
        except Exception as e:
            self.logger.error(f"Gemini setup failed: {e}")
            self.has_gemini = False
    
    def _setup_ollama(self):
        """Initialize Ollama for RAG chat."""
        try:
            from ai.ollama_client import ollama_client
            self.ollama_client = ollama_client
            self.has_ollama = True
            self.logger.info("Ollama initialized (for RAG chat only)")
        except Exception as e:
            self.logger.warning(f"Ollama not available: {e}")
            self.has_ollama = False
            self.ollama_client = None

    async def process(self, task: Task, context: Optional[dict] = None) -> str:
        """
        Route the prompt to the appropriate model.
        
        Context options:
        - 'use_rag': True → Use Ollama with injected context for chat
        - 'rag_context': str → Context from vector DB to inject
        - Otherwise → Use Gemini (default)
        """
        prompt = task.description
        use_rag = context.get('use_rag', False) if context else False
        
        if use_rag and self.has_ollama:
            rag_context = context.get('rag_context', '')
            return await self._call_ollama_rag(prompt, rag_context)
        elif self.has_gemini:
            return await self._call_gemini(prompt)
        elif self.has_ollama:
            # Fallback to Ollama if Gemini unavailable
            return await self._call_ollama(prompt)
        else:
            raise RuntimeError("No LLM available. Configure GEMINI_API_KEY or start Ollama.")

    async def _call_gemini(self, prompt: str) -> str:
        """Call Gemini API for analysis/extraction."""
        self.logger.info("→ Gemini (analysis)")
        try:
            response = await self.gemini_client.aio.models.generate_content(
                model=self.gemini_model,
                contents=prompt
            )
            return response.text
        except Exception as e:
            self.logger.error(f"Gemini failed: {e}")
            if self.has_ollama:
                return await self._call_ollama(prompt)
            raise

    async def _call_ollama(self, prompt: str) -> str:
        """Call Ollama as fallback."""
        self.logger.info("→ Ollama (fallback)")
        try:
            response = await self.ollama_client.generate(prompt)
            return response
        except Exception as e:
            self.logger.error(f"Ollama failed: {e}")
            raise

    async def _call_ollama_rag(self, query: str, context: str) -> str:
        """
        Call Ollama with RAG context injection for chat.
        
        Args:
            query: User's question
            context: Retrieved context from Qdrant
        """
        self.logger.info("→ Ollama (RAG chat)")
        
        rag_prompt = f"""You are SCARO, a supply chain intelligence assistant.
Use the following context to answer the user's question.

CONTEXT:
{context}

QUESTION:
{query}

INSTRUCTIONS:
1. Answer ONLY using the provided context.
2. If the context has the answer, be detailed and specific.
3. If the context does NOT have the answer, state: "I don't have enough data to answer that based on the current knowledge base."
4. Do not make up information.
5. <think>Analyze the context first to identify relevant facts before constructing the answer.</think>
"""
        try:
            response = await self.ollama_client.generate(rag_prompt)
            return response
        except Exception as e:
            self.logger.error(f"Ollama RAG failed: {e}")
            raise


# Convenience functions for direct use
_router = None

def get_router() -> LLMRouter:
    global _router
    if _router is None:
        _router = LLMRouter()
    return _router

async def analyze_with_gemini(prompt: str) -> str:
    """Quick access to Gemini for analysis."""
    router = get_router()
    task = Task(id="adhoc", description=prompt, agent_type="llm")
    return await router.process(task)

async def chat_with_rag(query: str, context: str) -> str:
    """Quick access to Ollama RAG chat."""
    router = get_router()
    task = Task(id="chat", description=query, agent_type="llm")
    return await router.process(task, {'use_rag': True, 'rag_context': context})

