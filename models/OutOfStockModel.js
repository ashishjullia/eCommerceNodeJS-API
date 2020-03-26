class OutOfStock {
    constructor (productId, requestedQuantity, inStock) {
        this.productId = productId;
        this.requestedQuantity = requestedQuantity;
        this.inStock = inStock;
    }
}

module.exports = OutOfStock;