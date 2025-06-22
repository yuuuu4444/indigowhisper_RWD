// js/cart-calculations.js (購物車計算核心邏輯)
// 將這些變數定義在模組頂部，在 DOMContentLoaded 後賦值
let _cartCalcCards; // 為了區分於其他檔案中的 cartCards
let _subtotalSpanCalc, _deliveryFeeSpanCalc, _discountSpanCalc, _cartSumTotalSpanCalc;
let _DELIVERY_FEE_CALC, _DISCOUNT_CALC;

/**
 * 計算單個商品的小計並更新顯示。
 * 此函數現在是全域可訪問的。
 * @param {HTMLElement} cartCard - 當前操作的商品卡片元素
 * @returns {number} 返回這個商品計算後的小計金額
 */
window.updateItemSubtotal = function(cartCard) {
    // 檢查卡片是否被隱藏 (例如被垃圾桶功能隱藏)，則視為 0
    if (cartCard.style.display === 'none') {
        return 0;
    }

    const priceElement = cartCard.querySelector('.cartItemPrice');
    const amountInput = cartCard.querySelector('.amountInput');
    const itemAmountResult = cartCard.querySelector('.itemAmountResult');

    if (!priceElement || !amountInput || !itemAmountResult) {
        console.warn('Warning: Missing elements for item subtotal calculation in a cartCard.', cartCard);
        return 0;
    }

    const price = parseFloat(priceElement.dataset.price); 
    let quantity = parseInt(amountInput.value);

    const min = parseInt(amountInput.min) || 1;
    const max = parseInt(amountInput.max) || Infinity;

    if (isNaN(quantity) || quantity < min) {
        quantity = min;
    } else if (quantity > max) {
        quantity = max;
    }
    amountInput.value = quantity;

    const subtotal = price * quantity;
    itemAmountResult.textContent = subtotal.toLocaleString();

    return subtotal;
};

/**
 * 計算所有商品的小計總和，並更新最終合計區塊。
 * 將此函數綁定到 window，使其可以在其他 JS 檔案中被調用。
 */
window.updateCartSummary = function() { 
    let currentProductsSubtotal = 0;

    // 每次調用時重新獲取所有商品卡片，以確保是最新的 DOM 狀態
    // 因為購物車內容可能動態變化（例如被垃圾桶移除）
    document.querySelectorAll('.cartCard').forEach(cartCard => {
        currentProductsSubtotal += window.updateItemSubtotal(cartCard);
    });

    if (_subtotalSpanCalc) {
        _subtotalSpanCalc.textContent = currentProductsSubtotal.toLocaleString();
    }

    let finalTotal = currentProductsSubtotal + (_DELIVERY_FEE_CALC || 0) + (_DISCOUNT_CALC || 0);

    if (_cartSumTotalSpanCalc) {
        _cartSumTotalSpanCalc.textContent = `NT ${finalTotal.toLocaleString()}`;
    }
};

// 頁面載入後，初始化購物車總計相關的 DOM 元素和事件
document.addEventListener('DOMContentLoaded', () => {
    _cartCalcCards = document.querySelectorAll('.cartCard'); // 初始化一次
    _subtotalSpanCalc = document.getElementById('subTotal');
    _deliveryFeeSpanCalc = document.getElementById('deliveryFee');
    _discountSpanCalc = document.getElementById('discount');
    _cartSumTotalSpanCalc = document.getElementById('cartSumTotal');

    _DELIVERY_FEE_CALC = parseFloat(_deliveryFeeSpanCalc ? _deliveryFeeSpanCalc.textContent : '0') || 0;
    _DISCOUNT_CALC = parseFloat(_discountSpanCalc ? _discountSpanCalc.textContent : '0') || 0;

    // 為購物車商品加減按鈕和輸入框綁定事件
    _cartCalcCards.forEach(cartCard => {
        const minusBtn = cartCard.querySelector('.minus');
        const plusBtn = cartCard.querySelector('.plus');
        const amountInput = cartCard.querySelector('.amountInput');

        if (minusBtn && plusBtn && amountInput) {
            minusBtn.addEventListener('click', () => {
                let currentValue = parseInt(amountInput.value);
                if (currentValue > parseInt(amountInput.min || '1')) {
                    amountInput.value = currentValue - 1;
                    window.updateCartSummary(); 
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentValue = parseInt(amountInput.value);
                if (currentValue < parseInt(amountInput.max || 'Infinity')) {
                    amountInput.value = currentValue + 1;
                    window.updateCartSummary(); 
                }
            });

            amountInput.addEventListener('change', () => {
                window.updateCartSummary(); 
            });
        }
    });

    // 首次載入時執行一次總計更新
    window.updateCartSummary();
});

// js/cart-remove.js (垃圾桶清除邏輯)
// 依賴: cart-calculations.js (window.updateCartSummary)

document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有垃圾桶按鈕
    const trashButtons = document.querySelectorAll('.trash');

    trashButtons.forEach(trashBtn => {
        trashBtn.addEventListener('click', (event) => {
            // 找到最近的父級 .cartCard
            const cartCard = event.target.closest('.cartCard');
            
            if (cartCard) {
                const amountInput = cartCard.querySelector('.amountInput');

                // 方式一：將對應商品的數量設為 0
                if (amountInput) { 
                    amountInput.value = 0; 
                }
                
                // 調用 cart-calculations.js 中定義的全域更新總計函數
                if (typeof window.updateCartSummary === 'function') {
                    window.updateCartSummary(); 
                } else {
                    console.error('Error: window.updateCartSummary function not found. Make sure cart-calculations.js is loaded correctly BEFORE cart-remove.js.');
                }

                // 方式二 (如果你未來想要卡片消失，則取消註釋)：
                // cartCard.style.display = 'none'; 
                // if (typeof window.updateCartSummary === 'function') {
                //     window.updateCartSummary(); 
                // }
            }
        });
    });
});
