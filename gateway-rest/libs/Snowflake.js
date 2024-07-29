const DEFAULTS = {
    WORKER_ID: 0,
    EPOCH: 1597017600000, // August 10, 2020 at 00:00:00 UTC
};

const CONFIG = {
    TIMESTAMP_BITS: 42,
    WORKER_ID_BITS: 10,
    SEQUENCE_BITS: 12,
};

class Snowflake {
    static lastTimestamp = -1;
    static sequence  = 0;
    static maxSequence = (1 << CONFIG.SEQUENCE_BITS) - 1;

    static async generate(){
        let timestamp = Date.now();
        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & this.maxSequence;
            if (this.sequence === 0) {
                timestamp = this.waitNextMillis(timestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        const timestampOffset = timestamp - DEFAULTS.EPOCH;
        const workerId = DEFAULTS.WORKER_ID;

        const timestampBits = timestampOffset.toString(2).padStart(CONFIG.TIMESTAMP_BITS, '0');
        const workerIdBits = workerId.toString(2).padStart(CONFIG.WORKER_ID_BITS, '0');
        const sequenceBits = this.sequence.toString(2).padStart(CONFIG.SEQUENCE_BITS, '0');

        const idBinary = `${timestampBits}${workerIdBits}${sequenceBits}`;
        const idDecimal = BigInt('0b' + idBinary).toString();

        return idDecimal.toString();
    }

    static waitNextMillis(timestamp) {
        while (timestamp <= this.lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }
}

module.exports = {
    Snowflake,
    CONFIG,
    DEFAULTS
}