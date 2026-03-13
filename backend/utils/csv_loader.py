import pandas as pd
import os
import csv

def load_attractions_safe():
    """Safely load attractions CSV with error handling"""
    try:
        # Try multiple possible filenames
        possible_files = [
            'chennai_attractions_complete.csv',
            'chennai_attractions.csv',
            'attractions.csv'
        ]
        
        csv_file = None
        for file in possible_files:
            if os.path.exists(file):
                csv_file = file
                break
        
        if not csv_file:
            print("⚠️ No attractions CSV file found")
            return pd.DataFrame()
        
        # Try different parsing methods
        try:
            # Method 1: Standard pandas read
            df = pd.read_csv(csv_file)
            print(f"✅ Loaded {len(df)} attractions from {csv_file}")
            return df
        except Exception as e1:
            try:
                # Method 2: With custom separator
                df = pd.read_csv(csv_file, delimiter=',', quoting=csv.QUOTE_ALL)
                print(f"✅ Loaded {len(df)} attractions (method 2)")
                return df
            except Exception as e2:
                try:
                    # Method 3: Manual line by line
                    data = []
                    with open(csv_file, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        headers = lines[0].strip().split(',')
                        for line in lines[1:]:
                            if line.strip():
                                # Simple split for clean data
                                values = line.strip().split(',')
                                if len(values) == len(headers):
                                    data.append(dict(zip(headers, values)))
                    df = pd.DataFrame(data)
                    print(f"✅ Loaded {len(df)} attractions (method 3)")
                    return df
                except Exception as e3:
                    print(f"❌ All CSV parsing methods failed")
                    return pd.DataFrame()
    
    except Exception as e:
        print(f"⚠️ Error loading attractions: {e}")
        return pd.DataFrame()

def get_default_attractions():
    """Return default attractions if CSV fails"""
    return pd.DataFrame([
        {'place_name': 'Marina Beach', 'category': 'Beach', 'avg_cost': 0, 'popularity': 9.8},
        {'place_name': 'Kapaleeshwarar Temple', 'category': 'Temple', 'avg_cost': 0, 'popularity': 9.5},
        {'place_name': 'Express Avenue', 'category': 'Shopping', 'avg_cost': 1000, 'popularity': 9.0},
        {'place_name': 'Fort St George', 'category': 'Heritage', 'avg_cost': 200, 'popularity': 8.5},
        {'place_name': 'Murugan Idli Shop', 'category': 'Food', 'avg_cost': 300, 'popularity': 9.0},
    ])