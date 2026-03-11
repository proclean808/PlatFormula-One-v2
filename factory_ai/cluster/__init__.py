"""
factory_ai.cluster — Distributed Ray Cluster Configuration
============================================================

Files:
  cluster_config.yaml  Complete multi-device cluster blueprint.
                       Defines head node (S25 Ultra), CPU worker,
                       GPU worker, and cloud spot worker profiles
                       with autoscaling policies and service layout.

  node_setup.py        Bootstrap utility for each node role.
                       Run with --guide for per-role instructions.
                       Run with --role head|cpu|gpu|cloud to execute.

Quick start:
  # Head node (S25 Ultra / any host)
  python -m factory_ai.cluster.node_setup --role head --guide

  # GPU worker
  python -m factory_ai.cluster.node_setup --role gpu --head-ip 192.168.1.10 --guide
"""
