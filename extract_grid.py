import requests
import re
from html.parser import HTMLParser

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = []
        self.in_td = False
        self.current_cell = ''
        
    def handle_starttag(self, tag, attrs):
        if tag in ['td', 'th']:
            self.in_td = True
            self.current_cell = ''
    
    def handle_endtag(self, tag):
        if tag in ['td', 'th']:
            self.in_td = False
            self.data.append(self.current_cell.strip())
        elif tag == 'tr':
            if len(self.data) > 0:
                self.data.append('\n')
    
    def handle_data(self, data):
        if self.in_td:
            self.current_cell += data

def print_grid_from_doc(url: str) -> None:
    # Fetch the published Google Doc
    resp = requests.get(url)
    resp.raise_for_status()
    html_text = resp.text

    # Parse the table
    parser = TableParser()
    parser.feed(html_text)
    
    # Extract cell data
    cells = parser.data
    print(f"Total cells extracted: {len(cells)}")
    print("First 30 cells:")
    for i, cell in enumerate(cells[:30]):
        print(f"  {i}: {repr(cell)}")
    
    # Parse into rows of 3 (x, character, y) - NOTE: order is different!
    positions = []
    row_data = []
    for cell in cells:
        if cell == '\n':
            if len(row_data) == 3:
                try:
                    x = int(row_data[0])  # x is first
                    ch = row_data[1]       # character is second
                    y = int(row_data[2])   # y is third
                    positions.append((ch, x, y))
                except (ValueError, IndexError):
                    pass
            row_data = []
        elif cell and cell not in ['x-coordinate', 'Character', 'y-coordinate']:  # Skip headers
            row_data.append(cell)
    
    # Handle last row
    if len(row_data) == 3:
        try:
            ch = row_data[0]
            x = int(row_data[1])
            y = int(row_data[2])
            positions.append((ch, x, y))
        except ValueError:
            pass
    
    print(f"\nPositions found: {len(positions)}")
    if positions:
        print("First 10 positions:")
        for pos in positions[:10]:
            print(f"  {pos}")
    
    if not positions:
        return

    # Determine grid size
    max_x = max(p[1] for p in positions)
    max_y = max(p[2] for p in positions)

    # Create grid filled with spaces
    grid = [[' ' for _ in range(max_x + 1)] for _ in range(max_y + 1)]

    # Place characters
    for ch, x, y in positions:
        if 0 <= y <= max_y and 0 <= x <= max_x:
            grid[y][x] = ch

    # Print grid
    print("\nGrid visualization:")
    for row in grid:
        print(''.join(row))
    
    # Extract uppercase letters in reading order
    uppercase = []
    for row in grid:
        for ch in row:
            if ch.isupper():
                uppercase.append(ch)
    
    result = ''.join(uppercase)
    if result:
        print(f"\nSecret message (uppercase letters): {result}")
    else:
        print("\nNo uppercase letters found in grid")

    # Determine grid size
    max_x = max(p[1] for p in positions)
    max_y = max(p[2] for p in positions)

    # Create grid filled with spaces
    grid = [[' ' for _ in range(max_x + 1)] for _ in range(max_y + 1)]

    # Place characters
    for ch, x, y in positions:
        grid[y][x] = ch

    # Print grid
    grid_str = '\n'.join(''.join(row) for row in grid)
    print("Grid:")
    print(grid_str)
    print()
    
    # Extract uppercase letters in order they appear (reading left to right, top to bottom)
    uppercase = []
    for row in grid:
        for ch in row:
            if ch.isupper():
                uppercase.append(ch)
    
    result = ''.join(uppercase)
    print(f"Uppercase letters: {result}")
    print(f"Total uppercase letters: {len(result)}")

# Run the function
url = 'https://docs.google.com/document/d/e/2PACX-1vRPzbNQcx5UriHSbZ-9vmsTow_R6RRe7eyAU60xIF9Dlz-vaHiHNO2TKgDi7jy4ZpTpNqM7EvEcfr_p/pub'
print_grid_from_doc(url)
