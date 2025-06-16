def combine_predictions(image_pred, gene_pred, threshold=0.6):
    # Example logic
    if image_pred[1] > threshold:
        return image_pred
    elif gene_pred[1] > threshold:
        return gene_pred
    else:
        return ("Uncertain", 0.5)
