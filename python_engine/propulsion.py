import math
G0=9.80665
def size_vehicle(payload_kg, delta_v_kms, isp_s, stages):
    # Simplified classroom mass-ratio model with a conservative illustrative structural fraction.
    dv=max(0.1, delta_v_kms*1000)
    ve=isp_s*G0
    mass_ratio=math.exp(min(dv/(max(1,stages)*ve), 8))
    propellant=payload_kg*(mass_ratio-1)
    liftoff=payload_kg+propellant
    return {"payloadKg":round(payload_kg,1),"ispSeconds":isp_s,"stages":stages,
            "deltaVKms":delta_v_kms,"exhaustVelocityMs":round(ve,1),
            "illustrativePropellantKg":round(propellant,1),"illustrativeLiftoffMassKg":round(liftoff,1),
            "status":"EDUCATIONAL ESTIMATE",
            "warning":"Not validated for real propulsion, structural design, staging, launch, or safety decisions."}
