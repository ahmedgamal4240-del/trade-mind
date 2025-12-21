import pandas as pd
import numpy as np
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.trend import MACD, SMAIndicator, EMAIndicator, IchimokuIndicator
from ta.volatility import BollingerBands, AverageTrueRange
from ta.volume import OnBalanceVolumeIndicator

# ... imports ...

def calculate_technical_indicators(df: pd.DataFrame):
    """
    Adds technical indicators to the DataFrame.
    Expects columns: ['open', 'high', 'low', 'close', 'volume']
    """
    if df.empty:
        return {}

    # Ensure close is numeric
    close = df['close']
    high = df['high']
    low = df['low']
    volume = df['volume']

    # 1. RSI (14)
    rsi_indicator = RSIIndicator(close=close, window=14)
    df['rsi'] = rsi_indicator.rsi()

    # 2. MACD (12, 26, 9)
    macd = MACD(close=close)
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()
    df['macd_diff'] = macd.macd_diff()

    # 3. Bollinger Bands (20, 2 std dev)
    bollinger = BollingerBands(close=close, window=20, window_dev=2)
    df['bb_high'] = bollinger.bollinger_hband()
    df['bb_low'] = bollinger.bollinger_lband()
    df['bb_mid'] = bollinger.bollinger_mavg()

    # 4. SMA / EMA (Trend)
    df['sma_50'] = SMAIndicator(close=close, window=50).sma_indicator()
    df['sma_200'] = SMAIndicator(close=close, window=200).sma_indicator() # Added for Golden Cross
    df['ema_20'] = EMAIndicator(close=close, window=20).ema_indicator()
    
    # 5. Ichimoku Cloud (9, 26, 52)
    ichimoku = IchimokuIndicator(high=high, low=low, window1=9, window2=26, window3=52)
    df['ichimoku_a'] = ichimoku.ichimoku_a()
    df['ichimoku_b'] = ichimoku.ichimoku_b()
    df['ichimoku_base_line'] = ichimoku.ichimoku_base_line()
    df['ichimoku_conversion_line'] = ichimoku.ichimoku_conversion_line()

    # ... (existing indicators) ...

    # 6. On-Balance Volume (OBV)
    df['obv'] = OnBalanceVolumeIndicator(close=close, volume=volume).on_balance_volume()

    # 7. ATR (14) - Volatility / Stop Loss
    df['atr'] = AverageTrueRange(high=high, low=low, close=close, window=14).average_true_range()

    # --- NEW: Fibonacci & Pattern Recognition ---
    
    # Fibonacci Levels (based on last 100 periods or full DF)
    lookback = min(len(df), 100)
    recent_high = df['high'].rolling(window=lookback).max().iloc[-1]
    recent_low = df['low'].rolling(window=lookback).min().iloc[-1]
    diff = recent_high - recent_low
    
    fib_levels = {
        "0.0": recent_low,
        "0.236": recent_low + 0.236 * diff,
        "0.382": recent_low + 0.382 * diff,
        "0.5": recent_low + 0.5 * diff,
        "0.618": recent_low + 0.618 * diff,
        "0.786": recent_low + 0.786 * diff,
        "1.0": recent_high
    }

    # Candlestick Patterns
    # Doji: Open and Close are virtually equal
    df['doji'] = np.abs(df['open'] - df['close']) <= (df['high'] - df['low']) * 0.1
    
    # Hammer: Small body at top, long lower wick (Bullish)
    # Body is in upper third, lower wick is > 2x body
    body_size = np.abs(df['open'] - df['close'])
    lower_wick = np.minimum(df['open'], df['close']) - df['low']
    upper_wick = df['high'] - np.maximum(df['open'], df['close'])
    df['hammer'] = (lower_wick > 2 * body_size) & (upper_wick < body_size)
    
    # Engulfing (Bullish)
    # Prev candle Red, Curr candle Green, Curr body engulfs prev body
    prev_open = df['open'].shift(1)
    prev_close = df['close'].shift(1)
    df['bullish_engulfing'] = (prev_close < prev_open) & (df['close'] > df['open']) & \
                              (df['open'] < prev_close) & (df['close'] > prev_open)

    # Return the latest values as a summary dict
    latest = df.iloc[-1]
    
    # Determine basic signal state
    macd_signal = "Bullish" if latest['macd'] > latest['macd_signal'] else "Bearish"
    rsi_state = "Overbought" if latest['rsi'] > 70 else ("Oversold" if latest['rsi'] < 30 else "Neutral")
    
    # Advanced Signals
    # Golden Cross: SMA 50 > SMA 200 (detect if it recently crossed or is just above)
    golden_cross = latest['sma_50'] > latest['sma_200'] if not np.isnan(latest['sma_200']) else False
    
    # Ichimoku Status
    cloud_top = max(latest['ichimoku_a'], latest['ichimoku_b'])
    cloud_bottom = min(latest['ichimoku_a'], latest['ichimoku_b'])
    ichimoku_status = "Neutral"
    if latest['close'] > cloud_top:
        ichimoku_status = "Bullish (Above Cloud)"
    elif latest['close'] < cloud_bottom:
        ichimoku_status = "Bearish (Below Cloud)"
    elif cloud_bottom <= latest['close'] <= cloud_top:
        ichimoku_status = "Congested (In Cloud)"

    # Identify Patterns detected on LATEST candle
    patterns = []
    if latest['doji']: patterns.append("Doji")
    if latest['hammer']: patterns.append("Hammer")
    if latest['bullish_engulfing']: patterns.append("Bullish Engulfing")
    
    return {
        "rsi": round(latest['rsi'], 2),
        "rsi_state": rsi_state,
        "macd": round(latest['macd'], 2),
        "macd_signal": macd_signal,
        "bb_position": round((latest['close'] - latest['bb_low']) / (latest['bb_high'] - latest['bb_low']), 2),
        "current_price": round(latest['close'], 2),
        "sma_50": round(latest['sma_50'], 2) if not np.isnan(latest['sma_50']) else None,
        "sma_200": round(latest['sma_200'], 2) if not np.isnan(latest['sma_200']) else None,
        "golden_cross": golden_cross,
        "ichimoku_status": ichimoku_status,
        "atr": round(latest['atr'], 2),
        "obv": round(latest['obv'], 2),
        "patterns": patterns,
        "fibonacci_levels": {k: round(v, 2) for k, v in fib_levels.items()}
    }

def train_and_predict(df: pd.DataFrame):
    """
    Trains a lightweight Random Forest model to predict the NEXT day's close.
    """
    if len(df) < 50:
        return {"error": "Not enough data for ML prediction (need 50+ candles)"}

    try:
        # Feature Engineering
        df['target'] = df['close'].shift(-1) # Next day's price
        
        # Features: Lagged returns, volatility, volume change
        df['return_1d'] = df['close'].pct_change()
        df['vol_change'] = df['volume'].pct_change()
        df['high_low_pct'] = (df['high'] - df['low']) / df['close']
        
        # Clean NaNs
        model_df = df.dropna().copy()
        
        if model_df.empty:
            return {"error": "Data validation failed"}

        features = ['return_1d', 'vol_change', 'high_low_pct', 'rsi', 'macd']
        # Simple fill provided we calculated indicators previously. 
        # If indicators aren't in DF yet (if called separately), we'd need to add them.
        # Assuming df already has indicators from calculate_technical_indicators
        
        X = model_df[features]
        y = model_df['target']
        
        # Split (Training on past, Testing on recent) -- simple validation
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        
        model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate
        predictions = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, predictions))
        
        # Predict NEXT Day (using the very last row of available data)
        last_row = df.iloc[[-1]][features]
        # Impute if needed (though indicators should be present)
        last_row = last_row.fillna(0) 
        
        next_price = model.predict(last_row)[0]
        current_price = df.iloc[-1]['close']
        predicted_change = ((next_price - current_price) / current_price) * 100
        
        confidence = "High" if rmse < (current_price * 0.02) else "Medium" # Simple heuristic
        if rmse > (current_price * 0.05): confidence = "Low"

        return {
            "predicted_price": round(next_price, 2),
            "predicted_change_percent": round(predicted_change, 2),
            "direction": "Up" if next_price > current_price else "Down",
            "confidence": confidence,
            "model_error_rmse": round(rmse, 2)
        }

    except Exception as e:
        print(f"ML Error: {e}")
        return {"error": str(e)}
