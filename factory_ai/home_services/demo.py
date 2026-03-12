"""
HomeService Pipeline Demo — simulates five inbound leads across channels.
Run: python -m factory_ai.home_services.demo
"""

import json
from factory_ai.home_services.pipeline import HomeServicePipeline

SAMPLE_LEADS = [
    {
        "channel": "phone",
        "raw_input": "Hi my AC stopped working completely, it's 95 degrees outside and I have a newborn at home. I need someone TODAY.",
        "contact": "Maria Santos",
        "address": "4821 Oak Creek Dr, Austin TX 78745",
    },
    {
        "channel": "angi",
        "raw_input": "Looking for the cheapest quote to replace my old furnace. Just want to compare prices.",
        "contact": "Dave Kim",
        "address": "1102 Maple Ave, Austin TX 78704",
    },
    {
        "channel": "google_ads",
        "raw_input": "My heat pump is making a loud grinding noise and the house isn't warming up like it should. Not an emergency but want it fixed soon.",
        "contact": "Jennifer Walsh",
        "address": "9203 Sunset Blvd, Austin TX 78731",
    },
    {
        "channel": "website",
        "raw_input": "Need annual AC maintenance before summer. Central air system, about 5 years old. Homeowner.",
        "contact": "Robert Chen",
        "address": "3314 Pecan St, Austin TX 78702",
    },
    {
        "channel": "thumbtack",
        "raw_input": "Gas smell near furnace. House smells like rotten eggs.",
        "contact": "Priya Mehta",
        "address": "6718 Congress Ave, Austin TX 78751",
    },
]


def run_demo():
    print("=" * 60)
    print("HomeService AI Pipeline — Factory.ai Vertical Plugin Demo")
    print("=" * 60)

    pipeline = HomeServicePipeline()
    pipeline.boot()

    for i, lead in enumerate(SAMPLE_LEADS, 1):
        print(f"\n[Lead {i}/{len(SAMPLE_LEADS)}] Channel: {lead['channel'].upper()}")
        print(f"  Input: {lead['raw_input'][:80]}...")

        result = pipeline.process_lead(
            raw_input=lead["raw_input"],
            channel=lead["channel"],
            contact=lead["contact"],
            address=lead["address"],
        )

        print(f"  Lead ID: {result['lead_id']}")
        print(f"  Final action: {result['final_action'].upper()}")
        stages_done = list(result["stages"].keys())
        print(f"  Stages completed: {' → '.join(stages_done)}")

    print("\n" + "=" * 60)
    print("Pipeline Stats:")
    stats = pipeline.get_pipeline_stats()
    print(json.dumps(stats, indent=2))

    pipeline.shutdown()


if __name__ == "__main__":
    run_demo()
