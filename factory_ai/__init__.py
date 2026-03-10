"""
factory_ai — Factory.ai Skilled Droid Creation Pipeline
=======================================================
Stack: Ray.io · Ollama · Samsung Galaxy S25 Ultra (control node)

Architecture:
  DroidFactory   → compiles skill manifests into Ray actors
  SkilledDroid   → Ray actor + Ollama model + tool plugin registry
  Tool plugins   → modular, dynamically-loaded skill extensions
"""

from .factory import DroidFactory, SkillManifest
from .droid_actor import SkilledDroid

__all__ = ["DroidFactory", "SkilledDroid", "SkillManifest"]
__version__ = "1.0.0"
