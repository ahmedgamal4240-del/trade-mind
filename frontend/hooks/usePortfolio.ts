'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: number;
}

export interface Position {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice?: number; // For realtime calculation
}

const INITIAL_BALANCE = 100000; // $100k Paper Money

export const usePortfolio = () => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [portfolio, setPortfolio] = useState<Position[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedData = localStorage.getItem('trademind_paper_portfolio');
        if (storedData) {
            const { balance, portfolio, transactions } = JSON.parse(storedData);
            setBalance(balance);
            setPortfolio(portfolio);
            setTransactions(transactions);
        }
        setIsLoading(false);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('trademind_paper_portfolio', JSON.stringify({
                balance,
                portfolio,
                transactions
            }));
        }
    }, [balance, portfolio, transactions, isLoading]);

    const executeTrade = async (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) => {
        const totalCost = quantity * price;

        if (type === 'buy' && totalCost > balance) {
            throw new Error("Insufficient funds");
        }

        const newTransaction: Transaction = {
            id: uuidv4(),
            symbol,
            type,
            quantity,
            price,
            timestamp: Date.now(),
        };

        // Update Balance
        const newBalance = type === 'buy' ? balance - totalCost : balance + totalCost;
        setBalance(newBalance);

        // Update Portfolio
        setPortfolio(prev => {
            const existingPosIndex = prev.findIndex(p => p.symbol === symbol);
            let newPortfolio = [...prev];

            if (existingPosIndex > -1) {
                const existing = newPortfolio[existingPosIndex];
                if (type === 'buy') {
                    // Update Avg Price
                    const totalValue = (existing.quantity * existing.avgPrice) + totalCost;
                    const newQuantity = existing.quantity + quantity;
                    newPortfolio[existingPosIndex] = {
                        ...existing,
                        quantity: newQuantity,
                        avgPrice: totalValue / newQuantity
                    };
                } else {
                    // Reduce Quantity
                    const newQuantity = existing.quantity - quantity;
                    if (newQuantity <= 0) {
                        // Remove position if sold out
                        newPortfolio = newPortfolio.filter(p => p.symbol !== symbol);
                    } else {
                        newPortfolio[existingPosIndex] = {
                            ...existing,
                            quantity: newQuantity
                        };
                    }
                }
            } else if (type === 'buy') {
                // New Position
                newPortfolio.push({
                    symbol,
                    quantity,
                    avgPrice: price
                });
            } else {
                throw new Error("Cannot sell a stock you don't own");
            }

            return newPortfolio;
        });

        // Add Transaction
        setTransactions(prev => [newTransaction, ...prev]);

        return newTransaction;
    };

    const getPortfolioValue = (currentPrices: Record<string, number>) => {
        return portfolio.reduce((total, pos) => {
            const price = currentPrices[pos.symbol] || pos.avgPrice;
            return total + (pos.quantity * price);
        }, 0);
    };

    return {
        balance,
        portfolio,
        transactions,
        executeTrade,
        getPortfolioValue,
        isLoading
    };
};
