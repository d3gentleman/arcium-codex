import { GlossaryTermRecord } from '../types/domain';

export const glossaryTermRecords: GlossaryTermRecord[] = [
  {
    id: 'glossary-arcium',
    slug: 'arcium',
    term: 'Arcium',
    tag: 'NETWORK',
    summary:
      'Arcium is the decentralized confidential compute network this atlas is built around, designed to process encrypted data without relying on a single operator to see every input.',
    aliases: ['Arcium Network'],
    keywords: ['confidential computing', 'private computation', 'encrypted data', 'network'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Intro to Arcium',
      href: 'https://docs.arcium.com/developersintro-to-arcium',
    },
    relatedCategoryIds: ['enc-eco', 'enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-arx-node',
    slug: 'arx-node',
    term: 'Arx Node',
    tag: 'NETWORK_ROLE',
    summary:
      'Arx nodes are the participating compute peers that hold protected data shares and collaborate inside Arcium clusters during confidential execution.',
    aliases: ['Arx', 'Arcium Node'],
    keywords: ['node', 'peer', 'distributed compute', 'cluster participant'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Arcium and Arx Nodes',
      href: 'https://docs.arcium.com/introduction/basic-conceptsarcium-and-arx-nodes',
    },
    relatedCategoryIds: ['enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-cluster',
    slug: 'cluster',
    term: 'Cluster',
    tag: 'NETWORK_STRUCTURE',
    summary:
      'A cluster is the working group of nodes assigned to coordinate and execute a computation under a shared readiness and security model.',
    aliases: [],
    keywords: ['node group', 'coordination', 'readiness', 'compute group'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Clusters and MXEs',
      href: 'https://docs.arcium.com/introduction/basic-conceptsclusters-and-mxes-mpc-execution-environments',
    },
    relatedCategoryIds: ['enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-computation',
    slug: 'computation',
    term: 'Computation',
    tag: 'WORKFLOW',
    summary:
      'In Arcium, a computation is the unit of work that progresses from definition to execution and completion across the network.',
    aliases: ['Arcium Computation'],
    keywords: ['job', 'execution request', 'lifecycle', 'workflow'],
    priority: 'medium',
    source: {
      label: 'Arcium Docs: Lifecycle of an Arcium Computation',
      href: 'https://docs.arcium.com/computations/lifecycle-of-an-arcium-computationlifecycle-of-an-arcium-computation',
    },
    relatedCategoryIds: ['enc-infra', 'enc-eco'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-confidential-computing',
    slug: 'confidential-computing',
    term: 'Confidential Computing',
    tag: 'CORE_CONCEPT',
    summary:
      'Confidential computing is the practical outcome Arcium is targeting: useful computation over protected inputs without exposing the raw data during execution.',
    aliases: ['Confidential Compute', 'Private Compute'],
    keywords: ['protected inputs', 'encrypted execution', 'privacy'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Architecture Overview',
      href: 'https://docs.arcium.com/getting-started/architecture-overviewarchitecture-overview',
    },
    relatedCategoryIds: ['enc-crypto', 'enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-execution-workflow',
    slug: 'execution-workflow',
    term: 'Execution Workflow',
    tag: 'WORKFLOW',
    summary:
      'The execution workflow is the ordered path a computation follows once it enters an MXE, from readiness checks through collaborative processing and output delivery.',
    aliases: [],
    keywords: ['readiness check', 'processing', 'output', 'execution flow'],
    priority: 'medium',
    source: {
      label: 'Arcium Docs: Execution Workflow',
      href: 'https://docs.arcium.com/multi-party-execution-environments-mxes/overviewexecution-workflow',
    },
    relatedCategoryIds: ['enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-mpc',
    slug: 'multi-party-computation',
    term: 'Multi-Party Computation',
    tag: 'CRYPTOGRAPHY',
    summary:
      'Multi-Party Computation, or MPC, is the cryptographic approach that lets multiple participants compute together without any one party learning every secret input.',
    aliases: ['MPC'],
    keywords: ['cryptography', 'private computation', 'encrypted shares'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Multi-Party Computation (MPC)',
      href: 'https://docs.arcium.com/introduction/basic-conceptsmulti-party-computation-mpc',
    },
    relatedCategoryIds: ['enc-crypto'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-mxe',
    slug: 'mxe',
    term: 'MXE',
    tag: 'RUNTIME',
    summary:
      'MXE stands for MPC eXecution Environment, the execution surface where Arcium runs confidential workloads through distributed computation.',
    aliases: ['MXEs', 'MPC eXecution Environment'],
    keywords: ['execution environment', 'distributed compute', 'runtime'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: Clusters and MXEs',
      href: 'https://docs.arcium.com/introduction/basic-conceptsclusters-and-mxes-mpc-execution-environments',
    },
    relatedCategoryIds: ['enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-permissioned-cluster',
    slug: 'permissioned-cluster',
    term: 'Permissioned Cluster',
    tag: 'ACCESS_MODEL',
    summary:
      'A permissioned cluster is a cluster with controlled participation, used when a workflow needs a more curated operator set or tighter organizational control.',
    aliases: ['Permissioned Clusters'],
    keywords: ['access control', 'operator set', 'cluster policy'],
    priority: 'medium',
    source: {
      label: 'Arcium Docs: Permissioned Clusters',
      href: 'https://docs.arcium.com/clusters/permissioned-clusters',
    },
    relatedCategoryIds: ['enc-infra', 'enc-comp'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-secret-sharing',
    slug: 'secret-sharing',
    term: 'Secret Sharing',
    tag: 'CRYPTOGRAPHY',
    summary:
      'Secret sharing is the mechanism that splits sensitive inputs into pieces so the network can work on protected data without reconstructing the whole secret in one place.',
    aliases: ['Shared Secret', 'Split Shares'],
    keywords: ['shares', 'protected inputs', 'distribution'],
    priority: 'high',
    source: {
      label: 'Arcium Docs: How Secret Sharing Works',
      href: 'https://docs.arcium.com/developers/arcis/mental-modelhow-secret-sharing-works',
    },
    relatedCategoryIds: ['enc-crypto'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-share',
    slug: 'share',
    term: 'Share',
    tag: 'DATA_MODEL',
    summary:
      'A share is one fragment of a protected value after secret sharing; individual shares are useful for collaborative computation but not as raw plaintext on their own.',
    aliases: ['Encrypted Share', 'Share Fragment'],
    keywords: ['fragment', 'split data', 'private value'],
    priority: 'medium',
    source: {
      label: 'Arcium Docs: Overview of the Arcium Network',
      href: 'https://docs.arcium.com/indexoverview-of-the-arcium-network',
    },
    relatedCategoryIds: ['enc-crypto', 'enc-infra'],
    relatedNodeIds: ['arcium'],
  },
  {
    id: 'glossary-trustless-execution',
    slug: 'trustless-execution',
    term: 'Trustless Execution',
    tag: 'SECURITY_MODEL',
    summary:
      'Trustless execution refers to computations being carried out so users do not have to rely on a single operator or institution to believe the result.',
    aliases: [],
    keywords: ['verification', 'security model', 'operator trust'],
    priority: 'medium',
    source: {
      label: 'Arcium Docs: Trustless Execution',
      href: 'https://docs.arcium.com/introduction/basic-conceptstrustless-execution',
    },
    relatedCategoryIds: ['enc-comp', 'enc-crypto'],
    relatedNodeIds: ['arcium'],
  },
];

export function getGlossaryTermPath(slug: string): string {
  return `/glossary#${slug}`;
}
