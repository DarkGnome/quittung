export default function quittungModel (sequelize, DataTypes) {
  /**
   * A quittung (receipt).
   */
  var Quittung = sequelize.define('Quittung', {
    who_to: { type: DataTypes.TEXT, allowNull: false },
    who_from: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    reason_text: { type: DataTypes.TEXT, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    net: { type: DataTypes.INTEGER, allowNull: false },
    taxes: { type: DataTypes.INTEGER, allowNull: false },
    when: { type: DataTypes.TEXT, allowNull: false }
  })

  return Quittung
}
