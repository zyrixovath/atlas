import heapq, math, random
SIZE=80
def generate_terrain(body="Moon", seed=42):
    rng=random.Random(seed)
    scale={"Moon":1.0,"Mars":0.7,"Venus":1.3}.get(body,1.0)
    # Return compact seed metadata; the browser creates the deterministic visual height field.
    return {"body":body,"seed":seed,"size":SIZE,"roughness":scale,
            "source":"Synthetic demonstration terrain — not a measured planetary DEM"}
def find_path(seed, start, goal):
    rng=random.Random(seed)
    def cost(x,y):
        # Synthetic slope penalty, deterministic for a given seed.
        return 1 + 4*abs(math.sin((x+seed)*.18)*math.cos((y-seed)*.14))
    s=tuple(start); g=tuple(goal)
    openq=[(0,s)]; came={}; score={s:0}; visited=set()
    while openq:
        _,cur=heapq.heappop(openq)
        if cur==g: break
        if cur in visited: continue
        visited.add(cur)
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
            nxt=(cur[0]+dx,cur[1]+dy)
            if not (0<=nxt[0]<SIZE and 0<=nxt[1]<SIZE): continue
            cand=score[cur]+cost(*nxt)*(1.414 if dx and dy else 1)
            if cand<score.get(nxt,1e9):
                score[nxt]=cand; came[nxt]=cur
                h=math.hypot(g[0]-nxt[0],g[1]-nxt[1])
                heapq.heappush(openq,(cand+h,nxt))
    if g not in came and s!=g: return {"waypoints":[list(s),list(g)],"distanceUnits":0,"status":"fallback"}
    path=[g]
    while path[-1]!=s: path.append(came[path[-1]])
    path.reverse()
    return {"waypoints":[list(p) for p in path],"distanceUnits":round(score.get(g,0),2),"status":"simulated"}
