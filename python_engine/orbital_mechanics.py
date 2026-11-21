import math
# Simplified educational orbital reference values. Not a precision navigation ephemeris.
BODIES = {
    "Mercury": (0.387, 47.36, 87.97), "Venus": (0.723, 35.02, 224.70),
    "Earth": (1.000, 29.78, 365.25), "Mars": (1.524, 24.07, 686.98),
    "Jupiter": (5.203, 13.07, 4332.6), "Saturn": (9.537, 9.69, 10759.2),
    "Uranus": (19.19, 6.81, 30688.5), "Neptune": (30.07, 5.43, 60182.0),
    "Moon": (0.00257, 1.02, 27.32), "Ceres": (2.77, 17.9, 1680), "Pluto": (39.48, 4.74, 90560)
}
def ephemeris():
    rows=[]
    for i,(name,(au,vel,period)) in enumerate(BODIES.items()):
        angle=(i*37.7 + 12.0) % 360
        rows.append({"name":name,"distanceAU":au,"velocityKms":vel,"periodDays":period,
                     "longitudeDeg":round(angle,2),"xAU":round(au*math.cos(math.radians(angle)),4),
                     "yAU":round(au*math.sin(math.radians(angle)),4)})
    return rows
def transfer(origin, target):
    a=BODIES.get(origin, BODIES["Earth"])[0]
    b=BODIES.get(target, BODIES["Mars"])[0]
    tof=round(259.0*abs((a+b)/2)**1.5,1)
    dv=round(2.0+abs(b-a)*1.15,2)
    return {"origin":origin,"target":target,"mode":"Direct transfer (illustrative)",
            "deltaV_kms":dv,"tof_days":tof,"synodic_days":round(1/abs(1/BODIES.get(origin,BODIES["Earth"])[2]-1/BODIES.get(target,BODIES["Mars"])[2]),1) if origin!=target else None,
            "note":"Approximate educational estimate. Not a launch window or flight-design solution."}
