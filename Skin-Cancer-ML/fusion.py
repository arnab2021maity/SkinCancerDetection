#!/usr/bin/env python
# coding: utf-8

import numpy as np

# --- Triangular Membership Function ---
def triangular_membership(x, a, b, c):
    """
    Triangular membership function for fuzzy logic.
    
    Parameters:
        x: Input value
        a: Left boundary
        b: Peak (membership = 1)
        c: Right boundary
    
    Returns:
        Membership degree [0, 1]
    """
    if x <= a or x >= c:
        return 0
    elif a < x <= b:
        return (x - a) / (b - a)
    else:
        return (c - x) / (c - b)

# --- Fuzzify a confidence score into Low, Medium, High ---
def fuzzify_confidence(score):
    """
    Convert a crisp confidence score into fuzzy membership degrees.
    
    Parameters:
        score: Confidence score [0, 1]
    
    Returns:
        Dictionary with membership degrees for low, medium, high
    """
    return {
        "low": triangular_membership(score, 0.0, 0.2, 0.4),
        "medium": triangular_membership(score, 0.3, 0.5, 0.7),
        "high": triangular_membership(score, 0.6, 0.8, 1.0)
    }

# --- Select class from top-3 using fuzzy rules and domain penalty ---
def fuzzy_select_class(top3, dominant_class='melanoma', penalty_threshold=0.75):
    """
    Selects class from top-3 predictions using fuzzy logic and domain knowledge.
    
    Parameters:
        top3 (list): List of (label, confidence) tuples, top-3 predictions.
        dominant_class (str): Class to penalize if confidence is moderate.
        penalty_threshold (float): Confidence threshold for penalizing dominant class.

    Returns:
        (str, float): Selected label and adjusted confidence.
    """
    fuzzy_priority = {"low": 1, "medium": 2, "high": 3}
    results = []

    for i, (label, conf) in enumerate(top3):
        fz = fuzzify_confidence(conf)
        strength = max(fz, key=fz.get)
        
        # Rank-based weight: top prediction gets higher weight
        rank_weight = 1.0 if i == 0 else (0.8 if i == 1 else 0.6)
        score = fuzzy_priority[strength] * rank_weight * conf

        # Domain adjustment: penalize dominant class if confidence is moderate
        if label == dominant_class and conf < penalty_threshold:
            score *= 0.9
        elif label != dominant_class:
            score *= 1.1

        results.append((label, conf, score))

    # Select the class with highest adjusted score
    best = max(results, key=lambda x: x[2])
    return best[0], round(best[1], 4)

# --- Final fusion decision using selected labels and confidence ---
def fuzzy_fusion_decision(class_img, conf_img, class_num, conf_num):
    """
    Fuse image and numeric classification outputs using fuzzy logic.
    
    Parameters:
        class_img (str): Selected class label from image pipeline.
        conf_img (float): Confidence of selected class from image.
        class_num (str): Selected class label from numeric pipeline.
        conf_num (float): Confidence of selected class from numeric.

    Returns:
        (str, float): Final fused label and confidence.
    """
    fz_img = fuzzify_confidence(conf_img)
    fz_num = fuzzify_confidence(conf_num)

    strength_img = max(fz_img, key=fz_img.get)
    strength_num = max(fz_num, key=fz_num.get)

    # Case 1: Both models agree on the class
    if class_img == class_num:
        weights = {"low": 0.3, "medium": 0.6, "high": 0.9}
        numerator = fz_img[strength_img] * weights[strength_img] + fz_num[strength_num] * weights[strength_num]
        denominator = fz_img[strength_img] + fz_num[strength_num]
        fused_conf = numerator / denominator if denominator != 0 else 0.0
        return class_img, round(fused_conf, 4)

    # Case 2: Models disagree - prefer stronger fuzzy strength or raw confidence
    fuzzy_order = {"low": 1, "medium": 2, "high": 3}
    
    if fuzzy_order[strength_img] > fuzzy_order[strength_num]:
        return class_img, round(conf_img, 4)
    elif fuzzy_order[strength_num] > fuzzy_order[strength_img]:
        return class_num, round(conf_num, 4)
    else:
        # Same fuzzy strength - choose higher raw confidence
        return (class_img, round(conf_img, 4)) if conf_img >= conf_num else (class_num, round(conf_num, 4))

# --- Full pipeline: Fuzzy multimodal classification ---
def fuzzy_multimodal_classification(top3_image, top3_numeric, dominant_class='melanoma'):
    """
    Complete fuzzy multimodal classification pipeline.
    
    Parameters:
        top3_image (list): Top-3 predictions from image model [(label, confidence), ...]
        top3_numeric (list): Top-3 predictions from numeric model [(label, confidence), ...]
        dominant_class (str): Class to apply domain penalty to
    
    Returns:
        (str, float): Final predicted label and confidence
    """
    # Step 1: Select best class from each modality using fuzzy rules
    img_label, img_conf = fuzzy_select_class(top3_image, dominant_class)
    num_label, num_conf = fuzzy_select_class(top3_numeric, dominant_class)
    
    # Step 2: Fuse the two selected classes
    final_label, final_conf = fuzzy_fusion_decision(img_label, img_conf, num_label, num_conf)
    
    return final_label, final_conf
