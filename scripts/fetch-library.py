#!/usr/bin/env python3
"""Download the Booth three-stem library: CC0 Sonic Pi drums + FluidR3 GM notes."""

import json
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace/public/library")
SP = "https://raw.githubusercontent.com/sonic-pi-net/sonic-pi/dev/etc/samples"
FL = "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM"
NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

DRUMS = {
    "808": {
        "label": "808",
        "voices": {
            "kick": "bd_808.flac",
            "snare": "elec_mid_snare.flac",
            "hat": "hat_zap.flac",
            "open": "hat_metal.flac",
            "clap": "perc_snap.flac",
            "tom": "elec_fuzz_tom.flac",
            "ride": "elec_cymbal.flac",
        },
    },
    "club": {
        "label": "club",
        "voices": {
            "kick": "bd_klub.flac",
            "snare": "sn_dub.flac",
            "hat": "hat_noiz.flac",
            "open": "drum_cymbal_open.flac",
            "clap": "perc_snap2.flac",
            "tom": "drum_tom_mid_hard.flac",
            "ride": "drum_cymbal_hard.flac",
        },
    },
    "acoustic": {
        "label": "acoustic",
        "voices": {
            "kick": "drum_bass_hard.flac",
            "snare": "drum_snare_hard.flac",
            "hat": "drum_cymbal_closed.flac",
            "open": "drum_cymbal_open.flac",
            "clap": "perc_snap.flac",
            "tom": "drum_tom_lo_hard.flac",
            "ride": "ride_tri.flac",
        },
    },
    "soft": {
        "label": "soft",
        "voices": {
            "kick": "drum_bass_soft.flac",
            "snare": "drum_snare_soft.flac",
            "hat": "drum_cymbal_soft.flac",
            "open": "drum_cymbal_pedal.flac",
            "clap": "hat_tap.flac",
            "tom": "drum_tom_hi_soft.flac",
            "ride": "drum_cymbal_soft.flac",
        },
    },
    "room": {
        "label": "room",
        "voices": {
            "kick": "bd_jazz.flac",
            "snare": "sn_generic.flac",
            "hat": "hat_cab.flac",
            "open": "drum_cymbal_pedal.flac",
            "clap": "drum_cowbell.flac",
            "tom": "drum_tom_mid_soft.flac",
            "ride": "ride_via.flac",
        },
    },
    "vintage": {
        "label": "vintage",
        "voices": {
            "kick": "bd_ada.flac",
            "snare": "elec_lo_snare.flac",
            "hat": "hat_psych.flac",
            "open": "hat_sci.flac",
            "clap": "elec_pop.flac",
            "tom": "elec_fuzz_tom.flac",
            "ride": "elec_chime.flac",
        },
    },
    "boom": {
        "label": "boom",
        "voices": {
            "kick": "bd_boom.flac",
            "snare": "sn_dolf.flac",
            "hat": "hat_gem.flac",
            "open": "hat_gump.flac",
            "clap": "perc_snap.flac",
            "tom": "drum_tom_hi_hard.flac",
            "ride": "drum_splash_soft.flac",
        },
    },
    "haus": {
        "label": "haus",
        "voices": {
            "kick": "bd_haus.flac",
            "snare": "elec_hi_snare.flac",
            "hat": "hat_raw.flac",
            "open": "hat_len.flac",
            "clap": "elec_flip.flac",
            "tom": "elec_fuzz_tom.flac",
            "ride": "elec_bell.flac",
        },
    },
    "tek": {
        "label": "tek",
        "voices": {
            "kick": "bd_tek.flac",
            "snare": "elec_snare.flac",
            "hat": "hat_star.flac",
            "open": "hat_zild.flac",
            "clap": "elec_mid_snare.flac",
            "tom": "drum_tom_lo_soft.flac",
            "ride": "hat_metal.flac",
        },
    },
    "chip": {
        "label": "chip",
        "voices": {
            "kick": "bd_chip.flac",
            "snare": "elec_filt_snare.flac",
            "hat": "hat_bdu.flac",
            "open": "hat_cats.flac",
            "clap": "elec_blip.flac",
            "tom": "elec_wood.flac",
            "ride": "elec_chime.flac",
        },
    },
    "fat": {
        "label": "fat",
        "voices": {
            "kick": "bd_fat.flac",
            "snare": "sn_zome.flac",
            "hat": "hat_yosh.flac",
            "open": "hat_mess.flac",
            "clap": "perc_impact1.flac",
            "tom": "drum_tom_hi_hard.flac",
            "ride": "perc_bell.flac",
        },
    },
    "heavy": {
        "label": "heavy",
        "voices": {
            "kick": "drum_heavy_kick.flac",
            "snare": "drum_snare_hard.flac",
            "hat": "drum_cymbal_closed.flac",
            "open": "drum_splash_hard.flac",
            "clap": "perc_impact2.flac",
            "tom": "drum_tom_lo_hard.flac",
            "ride": "drum_cymbal_hard.flac",
        },
    },
    "hand": {
        "label": "hand",
        "voices": {
            "kick": "tabla_ghe1.flac",
            "snare": "tabla_na.flac",
            "hat": "tabla_te1.flac",
            "open": "tabla_tun1.flac",
            "clap": "tabla_tas1.flac",
            "tom": "tabla_dhec.flac",
            "ride": "perc_bell2.flac",
        },
    },
    "glitch": {
        "label": "glitch",
        "voices": {
            "kick": "bd_zome.flac",
            "snare": "glitch_perc1.flac",
            "hat": "glitch_perc2.flac",
            "open": "glitch_perc3.flac",
            "clap": "glitch_robot1.flac",
            "tom": "glitch_perc4.flac",
            "ride": "glitch_perc5.flac",
        },
    },
    "pure": {
        "label": "pure",
        "voices": {
            "kick": "bd_pure.flac",
            "snare": "sn_generic.flac",
            "hat": "hat_tap.flac",
            "open": "hat_cab.flac",
            "clap": "perc_till.flac",
            "tom": "drum_tom_mid_soft.flac",
            "ride": "drum_cymbal_soft.flac",
        },
    },
    "zum": {
        "label": "zum",
        "voices": {
            "kick": "bd_zum.flac",
            "snare": "sn_dolf.flac",
            "hat": "hat_gnu.flac",
            "open": "hat_hier.flac",
            "clap": "elec_blip.flac",
            "tom": "elec_wood.flac",
            "ride": "elec_tick.flac",
        },
    },
    "gas": {
        "label": "gas",
        "voices": {
            "kick": "bd_gas.flac",
            "snare": "elec_lo_snare.flac",
            "hat": "hat_zan.flac",
            "open": "hat_sci.flac",
            "clap": "elec_flip.flac",
            "tom": "elec_fuzz_tom.flac",
            "ride": "elec_bell.flac",
        },
    },
    "sone": {
        "label": "sone",
        "voices": {
            "kick": "bd_sone.flac",
            "snare": "elec_mid_snare.flac",
            "hat": "hat_raw.flac",
            "open": "hat_metal.flac",
            "clap": "perc_snap.flac",
            "tom": "drum_tom_mid_hard.flac",
            "ride": "elec_cymbal.flac",
        },
    },
}

BASS = {
    "finger": {"label": "finger bass", "inst": "electric_bass_finger", "lowpass": 1400},
    "pick": {"label": "picked bass", "inst": "electric_bass_pick", "lowpass": 1700},
    "upright": {"label": "upright bass", "inst": "acoustic_bass", "lowpass": 800},
    "synth": {"label": "synth bass", "inst": "synth_bass_1", "lowpass": 520},
    "sub": {"label": "sub bass", "inst": "synth_bass_2", "lowpass": 300},
    "fretless": {"label": "fretless bass", "inst": "fretless_bass", "lowpass": 1100},
    "slap": {"label": "slap bass", "inst": "slap_bass_1", "lowpass": 1800},
    "slap2": {"label": "slap bass ii", "inst": "slap_bass_2", "lowpass": 2000},
    "bow": {"label": "bowed bass", "inst": "contrabass", "lowpass": 700},
}

CHORDS = {
    "piano": {"label": "piano", "inst": "acoustic_grand_piano", "attack": 0.012, "release": 0.22, "highpass": 130},
    "rhodes": {"label": "rhodes", "inst": "electric_piano_1", "attack": 0.018, "release": 0.26, "highpass": 140},
    "wurli": {"label": "electric piano", "inst": "electric_piano_2", "attack": 0.014, "release": 0.2, "highpass": 150},
    "guitar": {"label": "steel guitar", "inst": "acoustic_guitar_steel", "attack": 0.008, "release": 0.16, "highpass": 160},
    "jazz": {"label": "jazz guitar", "inst": "electric_guitar_jazz", "attack": 0.01, "release": 0.18, "highpass": 150},
    "strings": {"label": "strings", "inst": "string_ensemble_1", "attack": 0.09, "release": 0.34, "highpass": 180},
    "synthstrings": {"label": "string section", "inst": "synth_strings_1", "attack": 0.11, "release": 0.36, "highpass": 170},
    "pad": {"label": "warm pad", "inst": "pad_2_warm", "attack": 0.12, "release": 0.4, "highpass": 200},
    "organ": {"label": "organ", "inst": "drawbar_organ", "attack": 0.02, "release": 0.12, "highpass": 110},
    "nylon": {"label": "nylon guitar", "inst": "acoustic_guitar_nylon", "attack": 0.01, "release": 0.18, "highpass": 150},
    "clean": {"label": "clean guitar", "inst": "electric_guitar_clean", "attack": 0.008, "release": 0.16, "highpass": 160},
    "clav": {"label": "clav", "inst": "clavinet", "attack": 0.006, "release": 0.12, "highpass": 180},
    "vibes": {"label": "vibes", "inst": "vibraphone", "attack": 0.01, "release": 0.4, "highpass": 200},
    "harp": {"label": "harp", "inst": "orchestral_harp", "attack": 0.012, "release": 0.34, "highpass": 140},
    "pizz": {"label": "pizzicato strings", "inst": "pizzicato_strings", "attack": 0.006, "release": 0.16, "highpass": 160},
    "tremolo": {"label": "tremolo strings", "inst": "tremolo_strings", "attack": 0.08, "release": 0.32, "highpass": 170},
    "box": {"label": "music box", "inst": "music_box", "attack": 0.004, "release": 0.28, "highpass": 220},
    "church": {"label": "church organ", "inst": "church_organ", "attack": 0.04, "release": 0.2, "highpass": 90},
    "choir": {"label": "choir", "inst": "choir_aahs", "attack": 0.08, "release": 0.36, "highpass": 160},
    "cello": {"label": "cello", "inst": "cello", "attack": 0.06, "release": 0.3, "highpass": 120},
    "brass": {"label": "brass", "inst": "brass_section", "attack": 0.03, "release": 0.18, "highpass": 140},
    "accordion": {"label": "accordion", "inst": "accordion", "attack": 0.03, "release": 0.16, "highpass": 140},
    "harmonica": {"label": "harmonica", "inst": "harmonica", "attack": 0.02, "release": 0.12, "highpass": 180},
    "marimba": {"label": "marimba", "inst": "marimba", "attack": 0.006, "release": 0.22, "highpass": 160},
    "honky": {"label": "honky-tonk piano", "inst": "honkytonk_piano", "attack": 0.008, "release": 0.16, "highpass": 150},
    "drive": {"label": "driven guitar", "inst": "overdriven_guitar", "attack": 0.008, "release": 0.14, "highpass": 180},
    "sax": {"label": "tenor sax", "inst": "tenor_sax", "attack": 0.03, "release": 0.16, "highpass": 140},
    "flute": {"label": "flute", "inst": "flute", "attack": 0.04, "release": 0.18, "highpass": 200},
    "bells": {"label": "bells", "inst": "tubular_bells", "attack": 0.01, "release": 0.45, "highpass": 180},
    "sweep": {"label": "sweep pad", "inst": "pad_8_sweep", "attack": 0.14, "release": 0.42, "highpass": 180},
    "poly": {"label": "polysynth", "inst": "pad_3_polysynth", "attack": 0.05, "release": 0.28, "highpass": 160},
    "rock": {"label": "rock organ", "inst": "rock_organ", "attack": 0.015, "release": 0.12, "highpass": 140},
    "horn": {"label": "horn", "inst": "french_horn", "attack": 0.05, "release": 0.22, "highpass": 130},
    "celesta": {"label": "celesta", "inst": "celesta", "attack": 0.006, "release": 0.32, "highpass": 200},
    "pan": {"label": "pan flute", "inst": "pan_flute", "attack": 0.04, "release": 0.2, "highpass": 180},
}

BASS_NOTES = list(range(28, 53, 3))
CHORD_NOTES = list(range(48, 82, 3))


def note_name(midi: int) -> str:
    return f"{NAMES[midi % 12]}{midi // 12 - 1}"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "booth-library"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def job_drum(kit: str, voice: str, src: str) -> str:
    dest = ROOT / "drums" / kit / f"{voice}.wav"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return f"keep {dest.name}"
    raw = fetch(f"{SP}/{src}")
    tmp = Path(f"/tmp/booth-{kit}-{voice}.flac")
    tmp.write_bytes(raw)
    subprocess.check_call(
        ["ffmpeg", "-y", "-v", "error", "-i", str(tmp), "-ac", "1", "-ar", "44100", "-t", "1.8", str(dest)],
    )
    return f"drum {kit}/{voice} {dest.stat().st_size}"


def job_note(kind: str, key: str, inst: str, midi: int) -> str:
    dest = ROOT / kind / key / f"{midi}.mp3"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 500:
        return f"keep {kind}/{key}/{midi}"
    name = note_name(midi)
    raw = fetch(f"{FL}/{inst}-mp3/{name}.mp3")
    dest.write_bytes(raw)
    return f"{kind} {key} {name} {dest.stat().st_size}"


def main() -> None:
    jobs = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        for kit, spec in DRUMS.items():
            for voice, src in spec["voices"].items():
                jobs.append(pool.submit(job_drum, kit, voice, src))
        for key, spec in BASS.items():
            for midi in BASS_NOTES:
                jobs.append(pool.submit(job_note, "bass", key, spec["inst"], midi))
        for key, spec in CHORDS.items():
            for midi in CHORD_NOTES:
                jobs.append(pool.submit(job_note, "chords", key, spec["inst"], midi))
        failed = 0
        for future in as_completed(jobs):
            try:
                print(future.result())
            except Exception as err:
                failed += 1
                print("FAIL", err)
        if failed:
            raise SystemExit(f"{failed} downloads failed")

    catalog = {
        "drums": {
            key: {
                "label": spec["label"],
                "files": {voice: f"/library/drums/{key}/{voice}.wav" for voice in spec["voices"]},
            }
            for key, spec in DRUMS.items()
        },
        "bass": {
            key: {
                "label": spec["label"],
                "lowpass": spec["lowpass"],
                "notes": [{"midi": midi, "url": f"/library/bass/{key}/{midi}.mp3"} for midi in BASS_NOTES],
            }
            for key, spec in BASS.items()
        },
        "chords": {
            key: {
                "label": spec["label"],
                "attack": spec["attack"],
                "release": spec["release"],
                "highpass": spec["highpass"],
                "notes": [{"midi": midi, "url": f"/library/chords/{key}/{midi}.mp3"} for midi in CHORD_NOTES],
            }
            for key, spec in CHORDS.items()
        },
    }
    (ROOT / "catalog.json").write_text(json.dumps(catalog))
    files = [p for p in ROOT.rglob("*") if p.is_file() and p.suffix in {".wav", ".mp3"}]
    total = sum(p.stat().st_size for p in files)
    print(f"files {len(files)} bytes {total}")


if __name__ == "__main__":
    main()
