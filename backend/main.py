"""
FastAPI backend for James Muganzi Portfolio – CV PDF Generator.

Endpoint:
    POST /generate-cv   { "template": "<template_key>" }  → PDF download
    GET  /health        → { "status": "ok" }
    GET  /templates     → list of available template keys + display names

CORS is configured to allow requests from the live portfolio domain and
common local development origins.  Update ALLOWED_ORIGINS before deploying
if you are serving under a custom domain.
"""

import logging

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from cv_data import JAMES_MUGANZI_CV
from cvpdfgenerator import DocumentService

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="James Muganzi – CV Generator API",
    description="Generates branded CV PDFs on demand for the portfolio website.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS – update ALLOWED_ORIGINS to match your live domain(s)
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "https://muganzijamesdev.com",
    "https://www.muganzijamesdev.com",
    # Local development
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1",
    "http://127.0.0.1:5500",
    "null",  # file:// protocol (VS Code Live Server / direct file open)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# ---------------------------------------------------------------------------
# Document service (initialised once at startup)
# ---------------------------------------------------------------------------
document_service = DocumentService()

# ---------------------------------------------------------------------------
# Valid templates – keys must match DocumentService.TEMPLATE_CONFIGS
# ---------------------------------------------------------------------------
TEMPLATES = {
    "uk_professional_template": "UK Professional",
    "bizarre_modern": "Bizarre & Modern",
    "minimal_professional": "Minimal Professional",
    "bold": "Bold",
    "millennial_style": "Millennial Style",
    "corporate_classic": "Corporate Classic",
}


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class CVRequest(BaseModel):
    template: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health", tags=["utility"])
async def health():
    """Quick health-check for load-balancers / uptime monitors."""
    return {"status": "ok"}


@app.get("/templates", tags=["utility"])
async def list_templates():
    """Return available template keys and their display names."""
    return {
        "templates": [
            {"key": key, "name": name} for key, name in TEMPLATES.items()
        ]
    }


@app.post("/generate-cv", tags=["cv"])
async def generate_cv(request: CVRequest):
    """
    Generate a CV PDF for James Muganzi using the requested template.

    Body:
        { "template": "bizarre_modern" }

    Returns:
        application/pdf  –  ready to download
    """
    if request.template not in TEMPLATES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown template '{request.template}'. "
            f"Valid options: {list(TEMPLATES.keys())}",
        )

    logger.info(f"Generating CV with template: {request.template}")

    try:
        pdf_bytes = await document_service.generate_cv_pdf(
            content=JAMES_MUGANZI_CV,
            candidate_name="James Muganzi",
            template_name=request.template,
        )
    except Exception as exc:
        logger.error(f"PDF generation failed: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="CV generation failed. Please try again.")

    # Produce a clean filename for the download
    template_slug = request.template.replace("_", "-")
    filename = f"James_Muganzi_CV_{template_slug}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Cache-Control": "no-store",
        },
    )


# ---------------------------------------------------------------------------
# Entry point (for local dev: python main.py)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
