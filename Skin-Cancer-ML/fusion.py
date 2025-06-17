# fusion.py

def triangular_membership(x, a, b, c):
    if x <= a or x >= c:
        return 0
    elif a < x <= b:
        return (x - a) / (b - a)
    else:
        return (c - x) / (c - b)

def fuzzify_confidence(score):
    return {
        "low": triangular_membership(score, 0.0, 0.2, 0.4),
        "medium": triangular_membership(score, 0.3, 0.5, 0.7),
        "high": triangular_membership(score, 0.6, 0.8, 1.0)
    }

def apply_fusion_rules(image_fuzzy, gene_fuzzy):
    return {
        "low": max(
            min(image_fuzzy["low"], gene_fuzzy["low"]),
            min(image_fuzzy["low"], gene_fuzzy["medium"]),
            min(image_fuzzy["medium"], gene_fuzzy["low"])
        ),
        "medium": max(
            min(image_fuzzy["medium"], gene_fuzzy["medium"]),
            min(image_fuzzy["high"], gene_fuzzy["low"]),
            min(image_fuzzy["low"], gene_fuzzy["high"])
        ),
        "high": max(
            min(image_fuzzy["high"], gene_fuzzy["high"]),
            min(image_fuzzy["medium"], gene_fuzzy["high"]),
            min(image_fuzzy["high"], gene_fuzzy["medium"])
        )
    }

def defuzzify(rules):
    output_values = {"low": 0.3, "medium": 0.6, "high": 0.9}
    numerator = sum(rules[label] * output_values[label] for label in rules)
    denominator = sum(rules[label] for label in rules)
    return numerator / denominator if denominator != 0 else 0.0

def fuzzy_fuse(image_score, gene_score):
    image_fuzzy = fuzzify_confidence(image_score)
    gene_fuzzy = fuzzify_confidence(gene_score)
    rules = apply_fusion_rules(image_fuzzy, gene_fuzzy)
    return defuzzify(rules)
